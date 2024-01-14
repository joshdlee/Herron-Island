import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { Auth } from 'aws-amplify';

function AdminScreen({ onLoginSuccess }) { // Receive the onLoginSuccess prop
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const [showChangePasswordPrompt, setShowChangePasswordPrompt] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);

  const theme = useTheme();

  const signIn = async () => {
    try {
      const currentTime = new Date().getTime();
      if (lastAttemptTime && currentTime - lastAttemptTime < 5 * 60 * 1000 && attempts >= 3) {
        throw new Error('Too many failed attempts. Please try again later.');
      }

      const user = await Auth.signIn(username, password);

      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setCognitoUser(user);
        setShowChangePasswordPrompt(true);
      } else {
        console.log('Successfully signed in:', user);
        setAttempts(0);
        onLoginSuccess(); // Call the onLoginSuccess function when the user logs in successfully
      }

    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.message);

      if (error.code === 'UserNotConfirmedException' || error.code === 'PasswordResetRequiredException' || error.code === 'NotAuthorizedException' || error.code === 'UserNotFoundException') {
        setAttempts(prevAttempts => prevAttempts + 1);
        setLastAttemptTime(new Date().getTime());
      }
    }
  };

  const handleNewPassword = async () => {
    try {
      await Auth.completeNewPassword(cognitoUser, newPassword);
      setShowChangePasswordPrompt(false);
      // Successfully changed password. Now you can navigate or do other tasks
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 5, backgroundColor: theme.colors.background }}>
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        mode="outlined"
        style={{ marginBottom: 12, width: 300 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        mode="outlined"
        style={{ marginBottom: 12, width: 300 }}
      />
      <Button mode="contained" onPress={signIn} style={{ marginBottom: 12 }} color={theme.colors.onBackground}>
        Sign In
      </Button>
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

      {showChangePasswordPrompt && (
        <>
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={true}
            mode="outlined"
            style={{ marginBottom: 12, width: 300 }}
          />
          <Button mode="contained" onPress={handleNewPassword} style={{ marginBottom: 12 }} color={theme.colors.onBackground}>
            Change Password
          </Button>
        </>
      )}
    </View>
  );
}

export default AdminScreen;
