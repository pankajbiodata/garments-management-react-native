import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {
  apiGet,
  apiPut,
} from '../services/api';

const EditSales = ({route, navigation}) => {
  const {id, order} = route.params;

  const [customers, setCustomers] = useState([]);

  function formatDateForInput(value) {
    if (!value) {
      return '';
    }

    if (
      typeof value === 'string' &&
      value.includes('T')
    ) {
      return value.substring(0, 10);
    }

    return String(value).substring(0, 10);
  }

  const [updatedOrder, setUpdatedOrder] = useState({
    orderId:
      order?.orderId || id || '',

    customerId:
      order?.customerId != null
        ? String(order.customerId)
        : '',

    date: formatDateForInput(
      order?.date,
    ),

    amount:
      order?.amount != null
        ? String(order.amount)
        : '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  // Handle expired JWT session
  const handleSessionExpired = () => {
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
  };

  // Load customers
  const loadCustomers = async () => {
    try {
      const data = await apiGet(
        '/Customer/GetCustomersList',
      );

      console.log(
        'GET CUSTOMERS RESPONSE:',
        data,
      );

      setCustomers(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'GET CUSTOMERS ERROR:',
        error,
      );

      if (
        error?.message ===
        'SESSION_EXPIRED'
      ) {
        handleSessionExpired();
        return;
      }

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load customers.',
      );
    }
  };

  const handleInputChange = (
    key,
    value,
  ) => {
    setUpdatedOrder(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update sales order
  const handleUpdateOrder = async () => {
    try {
      const orderId = Number(
        updatedOrder.orderId,
      );

      const customerId = Number(
        updatedOrder.customerId,
      );

      const date = String(
        updatedOrder.date ?? '',
      ).trim();

      const amount = Number(
        updatedOrder.amount,
      );

      if (
        !orderId ||
        isNaN(orderId)
      ) {
        Alert.alert(
          'Validation Error',
          'Order ID is invalid.',
        );
        return;
      }

      if (
        !customerId ||
        isNaN(customerId) ||
        customerId <= 0
      ) {
        Alert.alert(
          'Validation Error',
          'Please select a customer.',
        );
        return;
      }

      if (!date) {
        Alert.alert(
          'Validation Error',
          'Date is required.',
        );
        return;
      }

      // Validate YYYY-MM-DD
      const datePattern =
        /^\d{4}-\d{2}-\d{2}$/;

      if (
        !datePattern.test(date)
      ) {
        Alert.alert(
          'Validation Error',
          'Date must be in YYYY-MM-DD format.',
        );
        return;
      }

      if (
        updatedOrder.amount === '' ||
        isNaN(amount) ||
        amount < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Amount must be a valid non-negative number.',
        );
        return;
      }

      const payload = {
        orderId: orderId,
        customerId: customerId,
        date: `${date}T00:00:00`,
        amount: amount,
      };

      console.log(
        'UPDATE SALES PAYLOAD:',
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      /*
       * apiPut automatically adds:
       *
       * Authorization: Bearer <JWT>
       */
      const response = await apiPut(
        '/sales/updateOrder',
        payload,
      );

      console.log(
        'UPDATE SALES RESPONSE:',
        response,
      );

      Alert.alert(
        'Success',
        'Order updated successfully.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'UPDATE SALES ERROR:',
        error,
      );

      if (
        error?.message ===
        'SESSION_EXPIRED'
      ) {
        handleSessionExpired();
        return;
      }

      Alert.alert(
        'Update Error',
        error?.message ||
          'Unable to update sales order.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Edit Sales Order
      </Text>

      {/* Order ID */}

      <TextInput
        style={[
          styles.input,
          styles.disabledInput,
        ]}
        placeholder="Order ID"
        value={String(
          updatedOrder.orderId ?? '',
        )}
        editable={false}
      />

      {/* Customer */}

      <Text style={styles.label}>
        Customer
      </Text>

      <View
        style={
          styles.pickerContainer
        }>
        <Picker
          selectedValue={
            updatedOrder.customerId
          }
          onValueChange={value =>
            handleInputChange(
              'customerId',
              value,
            )
          }>
          <Picker.Item
            label="Select Customer"
            value=""
          />

          {customers.map(
            customer => (
              <Picker.Item
                key={String(
                  customer.customerID,
                )}
                label={`${customer.name} (${customer.customerID})`}
                value={String(
                  customer.customerID,
                )}
              />
            ),
          )}
        </Picker>
      </View>

      {/* Date */}

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={updatedOrder.date}
        onChangeText={value =>
          handleInputChange(
            'date',
            value,
          )
        }
      />

      {/* Amount */}

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={String(
          updatedOrder.amount ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'amount',
            value,
          )
        }
        keyboardType="decimal-pad"
      />

      {/* Update */}

      <View style={styles.button}>
        <Button
          title="Update Order"
          onPress={
            handleUpdateOrder
          }
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

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
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

export default EditSales;
