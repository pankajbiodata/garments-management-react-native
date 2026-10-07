import React, {useEffect, useState} from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {API_URL} from '../services/api';

const SetupScreen = ({navigation}) => {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const response = await fetch(
        `${API_URL}/Auth/setup-status`,
      );

      const data = await response.json();

      console.log('Setup status:', data);

      if (data.setupRequired === true) {
        navigation.replace('FirstAdmin');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      console.error('Setup status error:', error);

      // If API is unavailable, go to Login
      navigation.replace('Login');
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SetupScreen;
