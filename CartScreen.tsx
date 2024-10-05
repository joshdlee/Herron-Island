import React, { useContext, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useTheme, Button } from 'react-native-paper';
import { CartContext } from './src/CartContext';

const CartScreen = () => {
  const theme = useTheme();
  const { cart, clearCart, removeFromCart } = useContext(CartContext);
  const [showCheckoutFields, setShowCheckoutFields] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleCheckout = async () => {
    try {
      const paymentInfo = {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        postalCode: postalCode,
        amount: cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0) * 100,
        idempotencyKey: `${Date.now()}`,
      };

      console.log('Sending request to API:', paymentInfo, cart, email);

      const response = await fetch('https://om4eyjw7d4.execute-api.us-east-1.amazonaws.com/dev/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartItems: cart,
          paymentInfo: paymentInfo,
          email: email,
          last4: cardNumber.slice(-4)
        })
      });

      const responseData = await response.json();
      console.log('Response from API:', responseData);

      if (responseData.success) {
        clearCart();
        Alert.alert('Success', 'Transaction completed successfully');
      } else {
        Alert.alert('Error', responseData.error);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Error processing payment:', error);
    }
  };

  const totalItems = cart.length;
  const totalPrice = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  return (
    <View style={styles(theme).container}>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.id}-${item.size}-${index}`}
        renderItem={({ item, index }) => (
          <View style={styles(theme).item}>
            <Text style={styles(theme).name}>{item.name} - {item.size}</Text>
            <Text style={styles(theme).price}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity onPress={() => removeFromCart(item.id, item.size!)}>
              <Text style={styles(theme).remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles(theme).summary}>
        <Text style={styles(theme).summaryText}>Total Items: {totalItems}</Text>
        <Text style={styles(theme).summaryText}>Total Price: ${totalPrice.toFixed(2)}</Text>
      </View>
      {showCheckoutFields && (
        <>
          <TextInput
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            style={styles(theme).input}
            placeholderTextColor={theme.colors.primary}
          />
          <TextInput
            placeholder="Card Number"
            value={cardNumber}
            onChangeText={setCardNumber}
            style={styles(theme).input}
            placeholderTextColor={theme.colors.primary}
          />
          <TextInput
            placeholder="Expiry Date (MM/YY)"
            value={expiryDate}
            onChangeText={setExpiryDate}
            style={styles(theme).input}
            placeholderTextColor={theme.colors.primary}
          />
          <TextInput
            placeholder="CVV"
            value={cvv}
            onChangeText={setCvv}
            style={styles(theme).input}
            secureTextEntry
            placeholderTextColor={theme.colors.primary}
          />
          <TextInput
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            style={styles(theme).input}
            placeholderTextColor={theme.colors.primary}
          />
          <Button
            mode="contained"
            onPress={handleCheckout}
            style={styles(theme).checkoutButton}
            disabled={totalPrice === 0} // Disable button if total price is $0
          >
            Confirm Payment
          </Button>
        </>
      )}
      <Button
        mode="contained"
        onPress={() => setShowCheckoutFields(!showCheckoutFields)}
        style={styles(theme).checkoutButton}
      >
        {showCheckoutFields ? 'Hide Payment Fields' : 'Checkout'}
      </Button>
    </View>
  );
};

const styles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 15,
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    border: 0,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  name: {
    fontSize: 18,
    color: theme.colors.text,
  },
  price: {
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  remove: {
    color: 'red',
    marginTop: 5,
  },
  input: {
    height: 40,
    borderColor: theme.colors.primary,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: theme.colors.text,
  },
  checkoutButton: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
  },
  summary: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    border: 0,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.colors.text,
  },
});

export default CartScreen;
