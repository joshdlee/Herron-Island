const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();
const secretsManager = new AWS.SecretsManager();
// const { Client, Environment } = require('square'); // Commented out for testing

const tableName = process.env.API_HERRONISLAND_PRODUCTTABLE_NAME; // DynamoDB table name for products
const transactionTableName = process.env.API_HERRONISLAND_TRANSACTIONTABLE_NAME; // DynamoDB table name for transactions
const secretName = process.env.squareApiToken; // Secret name in AWS Secrets Manager

// let squareClient; // Commented out for testing

exports.handler = async (event) => {
    const { cartItems, paymentInfo, email, last4 } = JSON.parse(event.body);

    try {
        // Fetch the Square API token from Secrets Manager if not already fetched
        // if (!squareClient) {
        //     const secretData = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        //     const accessToken = secretData.SecretString;

        //     squareClient = new Client({
        //         environment: Environment.Sandbox, // Change to Environment.Production for live transactions
        //         accessToken: accessToken,
        //     });
        // }

        // Process payment with Square
        // const paymentsApi = squareClient.paymentsApi;
        // const requestBody = {
        //     sourceId: 'nonce-from-client', // Replace this with actual source id if needed
        //     idempotencyKey: paymentInfo.idempotencyKey,
        //     amountMoney: {
        //         amount: paymentInfo.amount,
        //         currency: 'USD',
        //     },
        //     card: {
        //         cardNumber: paymentInfo.cardNumber,
        //         expMonth: parseInt(paymentInfo.expiryDate.split('/')[0], 10),
        //         expYear: parseInt(paymentInfo.expiryDate.split('/')[1], 10),
        //         cvv: paymentInfo.cvv,
        //         postalCode: paymentInfo.postalCode,
        //     },
        // };

        // const paymentResponse = await paymentsApi.createPayment(requestBody);

        // if (paymentResponse.result.payment.status !== 'COMPLETED') {
        //     throw new Error('Payment not completed');
        // }

        // Mock payment response for testing
        const mockPaymentResponse = {
            result: {
                payment: {
                    status: 'COMPLETED',
                    id: 'mock-payment-id',
                },
            },
        };

        // Update DynamoDB inventory
        for (const item of cartItems) {
            // Retrieve the current item from DynamoDB
            const getItemParams = {
                TableName: tableName,
                Key: { id: item.id },
            };
            const currentItem = await dynamo.get(getItemParams).promise();

            // Find the size to update
            const sizeIndex = currentItem.Item.sizes.findIndex(size => size.size === item.size);

            if (sizeIndex !== -1) {
                const updateItemParams = {
                    TableName: tableName,
                    Key: { id: item.id },
                    UpdateExpression: `set sizes[${sizeIndex}].stock = sizes[${sizeIndex}].stock - :qty`,
                    ConditionExpression: `sizes[${sizeIndex}].stock >= :qty`,
                    ExpressionAttributeValues: {
                        ':qty': item.quantity,
                    },
                };
                await dynamo.update(updateItemParams).promise();
                console.log(`Inventory updated for item: ${item.id}, size: ${item.size}`);
            } else {
                throw new Error(`Size ${item.size} not found for item ${item.id}`);
            }
        }

        // Store transaction details
        const transactionId = `${Date.now()}`; // Unique transaction ID
        const transactionItems = cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
        }));

        const transactionParams = {
            TableName: transactionTableName,
            Item: {
                id: transactionId,
                userEmail: email,
                amount: paymentInfo.amount / 100, // Convert to dollars
                items: transactionItems,
                paymentStatus: mockPaymentResponse.result.payment.status,
                paymentId: mockPaymentResponse.result.payment.id,
                last4: last4,
                createdAt: new Date().toISOString(),
            }
        };
        await dynamo.put(transactionParams).promise();

        // Construct itemized receipt
        let itemizedReceipt = 'Thank you for your purchase! Here is your itemized receipt:\n\n';
        cartItems.forEach(item => {
            itemizedReceipt += `Product: ${item.name}\n`;
            itemizedReceipt += `Size: ${item.size}\n`;
            itemizedReceipt += `Quantity: ${item.quantity}\n`;
            itemizedReceipt += `Price: $${item.price.toFixed(2)}\n\n`;
        });
        itemizedReceipt += `Total: $${(paymentInfo.amount / 100).toFixed(2)}\n`;
        itemizedReceipt += `Payment ID: ${mockPaymentResponse.result.payment.id}\n`;

        // Send confirmation email
        const emailParams = {
            Destination: {
                ToAddresses: [email],
                CcAddresses: ['x@joshdlee.com'] // Add your partners' emails here
            },
            Message: {
                Body: {
                    Text: { Data: itemizedReceipt }
                },
                Subject: { Data: 'Purchase Confirmation' }
            },
            Source: 'no-reply@herronisland.app' // Use your verified SES email address
        };
        await ses.sendEmail(emailParams).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, paymentResult: mockPaymentResponse.result.payment }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
