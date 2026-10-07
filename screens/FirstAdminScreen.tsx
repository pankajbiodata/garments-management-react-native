import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {API_URL} from '../services/api';

const FirstAdminScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    if (!username.trim()) {
      Alert.alert('Validation', 'Username is required.');
      return;
    }

    if (!password) {
      Alert.alert('Validation', 'Password is required.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Validation',
        'Password must contain at least 6 characters.',
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Validation',
        'Passwords do not match.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/Auth/create-first-admin`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username.trim(),
            password: password,
            role: 'Admin',
          }),
        },
      );

      const responseText = await response.text();

      let data = null;

      try {
        data = responseText
          ? JSON.parse(responseText)
          : null;
      } catch {
        data = null;
      }

      console.log(
        'Create first admin HTTP:',
        response.status,
      );

      console.log(
        'Create first admin response:',
        data || responseText,
      );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.Message ||
            responseText ||
            'Unable to create administrator.',
        );
      }

      Alert.alert(
        'Administrator Created',
        'The first administrator account has been created successfully.',
        [
          {
            text: 'Continue to Login',
            onPress: () => navigation.replace('Login'),
          },
        ],
      );
    } catch (error) {
      console.error(
        'Create administrator error:',
        error,
      );

      Alert.alert(
        'Error',
        error.message ||
          'Unable to create administrator.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>G</Text>
        </View>

        <Text style={styles.title}>
          Garments Management
        </Text>

        <Text style={styles.subtitle}>
          First Administrator Setup
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Create Administrator
          </Text>

          <Text style={styles.description}>
            Create the first administrator account for
            this application.
          </Text>

          <Text style={styles.label}>
            Username
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter administrator username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.buttonDisabled,
            ]}
            onPress={createAdmin}
            disabled={loading}>

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                CREATE ADMINISTRATOR
              </Text>
            )}

          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() =>
              navigation.replace('Login')
            }
            disabled={loading}>

            <Text style={styles.loginText}>
              Already configured? Login
            </Text>

          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },

  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#173F5F',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 38,
    fontWeight: 'bold',
  },

  title: {
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: '#173F5F',
  },

  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    elevation: 5,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#172033',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 21,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 17,
    backgroundColor: '#FAFBFC',
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#173F5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },

  loginButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  loginText: {
    color: '#173F5F',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default FirstAdminScreen;