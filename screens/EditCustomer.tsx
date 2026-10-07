import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import {apiPut} from '../services/api';

const EditCustomer = ({route, navigation}) => {
  // Get customer passed from CustomerScreen
  const {id, customer} = route.params;

  const [updatedCustomer, setUpdatedCustomer] = useState({
    customerID: customer?.customerID || id || '',
    name: customer?.name || '',
    contact: customer?.contact || '',
    address: customer?.address || '',
    transactions:
      customer?.transactions != null
        ? String(customer.transactions)
        : '0',
  });

  // Handle input changes
  const handleInputChange = (key, value) => {
    setUpdatedCustomer(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update customer
  const handleUpdateCustomer = async () => {
    try {
      const customerID = Number(
        updatedCustomer.customerID,
      );

      const name = String(
        updatedCustomer.name ?? '',
      ).trim();

      const contact = String(
        updatedCustomer.contact ?? '',
      ).trim();

      const address = String(
        updatedCustomer.address ?? '',
      ).trim();

      if (!customerID || isNaN(customerID)) {
        Alert.alert(
          'Validation Error',
          'Customer ID is invalid.',
        );
        return;
      }

      if (!name) {
        Alert.alert(
          'Validation Error',
          'Customer Name is required.',
        );
        return;
      }

      if (!contact) {
        Alert.alert(
          'Validation Error',
          'Contact Number is required.',
        );
        return;
      }

      if (!address) {
        Alert.alert(
          'Validation Error',
          'Address is required.',
        );
        return;
      }

      // Convert transactions to number
      const transactions =
        updatedCustomer.transactions === '' ||
        updatedCustomer.transactions == null
          ? 0
          : Number(updatedCustomer.transactions);

      if (isNaN(transactions)) {
        Alert.alert(
          'Validation Error',
          'Transactions must be a number.',
        );
        return;
      }

      const payload = {
        customerID: customerID,
        name: name,
        contact: contact,
        address: address,
        transactions: transactions,
      };

      console.log(
        'UPDATE CUSTOMER PAYLOAD:',
        JSON.stringify(payload, null, 2),
      );

      /*
       * apiPut automatically reads the JWT token from
       * AsyncStorage and sends:
       *
       * Authorization: Bearer <token>
       */
      const response = await apiPut(
        `/Customer/UpdateCustomer/${encodeURIComponent(
          String(customerID),
        )}`,
        payload,
      );

      console.log(
        'UPDATE CUSTOMER RESPONSE:',
        response,
      );

      Alert.alert(
        'Success',
        'Customer updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'UPDATE CUSTOMER ERROR:',
        error,
      );

      if (error?.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Please login again.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Login'}],
                });
              },
            },
          ],
        );
        return;
      }

      Alert.alert(
        'Update Error',
        error?.message ||
          'Unable to update customer.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Edit Customer
      </Text>

      {/* Customer ID */}

      <TextInput
        style={[
          styles.input,
          styles.disabledInput,
        ]}
        placeholder="Customer ID"
        value={String(
          updatedCustomer.customerID ?? '',
        )}
        editable={false}
      />

      {/* Name */}

      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        value={updatedCustomer.name}
        onChangeText={value =>
          handleInputChange('name', value)
        }
      />

      {/* Contact */}

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={updatedCustomer.contact}
        onChangeText={value =>
          handleInputChange('contact', value)
        }
        keyboardType="phone-pad"
      />

      {/* Address */}

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={updatedCustomer.address}
        onChangeText={value =>
          handleInputChange('address', value)
        }
      />

      {/* Transactions */}

      <TextInput
        style={styles.input}
        placeholder="Transactions"
        value={String(
          updatedCustomer.transactions ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'transactions',
            value,
          )
        }
        keyboardType="numeric"
      />

      {/* Update */}

      <View style={styles.button}>
        <Button
          title="Update Customer"
          onPress={handleUpdateCustomer}
        />
      </View>

      {/* Cancel */}

      <View style={styles.button}>
        <Button
          title="Cancel"
          color="gray"
          onPress={() =>
            navigation.goBack()
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 45,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },

  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },

  button: {
    marginTop: 10,
  },
});

export default EditCustomer;
