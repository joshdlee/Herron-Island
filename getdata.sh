#!/bin/bash

REGION="us-east-1" # Change this if your resources are in a different region

# Fetch the User Pool ID
USER_POOL_ID=$(aws cognito-idp list-user-pools --max-results 1 --region $REGION --query "UserPools[0].Id" --output text)

echo "User Pool ID: $USER_POOL_ID"

# Fetch the App Client ID associated with the User Pool
CLIENT_ID=$(aws cognito-idp list-user-pool-clients --user-pool-id $USER_POOL_ID --region $REGION --query "UserPoolClients[0].ClientId" --output text)

echo "App Client ID: $CLIENT_ID"
