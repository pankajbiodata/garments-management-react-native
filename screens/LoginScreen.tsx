import React, {useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAuth} from '../AuthContext';

const LoginScreen = () => {
  const {login} = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Validation', 'Username is required.');
      return;
    }

    if (!password) {
      Alert.alert('Validation', 'Password is required.');
      return;
    }

    try {
      setLoading(true);

      await login(
        username.trim(),
        password
      );
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.message || 'Unable to login.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }>

      <View style={styles.content}>

        <View style={styles.logo}>
          <Text style={styles.logoText}>G</Text>
        </View>

        <Text style={styles.title}>
          Garments Management
        </Text>

        <Text style={styles.subtitle}>
          Sign in to continue
        </Text>

        <View style={styles.card}>

          <Text style={styles.label}>
            Username
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}>

            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                LOGIN
              </Text>
            )}

          </TouchableOpacity>

        </View>

      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  logo: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#173F5F',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },

  title: {
    textAlign: 'center',
    color: '#173F5F',
    fontSize: 25,
    fontWeight: 'bold',
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    marginTop: 5,
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

  label: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 18,
    fontSize: 15,
    backgroundColor: '#FAFBFC',
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#173F5F',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default LoginScreen;