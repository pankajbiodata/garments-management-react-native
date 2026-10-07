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

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/sales';

const CUSTOMER_API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Customer';

const EditSales = ({route, navigation}) => {
  const {id, order} = route.params;

  const [customers, setCustomers] = useState([]);

  const [updatedOrder, setUpdatedOrder] = useState({
    orderId: order.orderId || id || '',
    customerId:
      order.customerId != null
        ? String(order.customerId)
        : '',
    date: formatDateForInput(order.date),
    amount:
      order.amount != null
        ? String(order.amount)
        : '',
  });

  useEffect(() => {
    loadCustomers();
  }, []);

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

  // Load customers
  const loadCustomers = async () => {
    try {
      const response = await fetch(
        `${CUSTOMER_API_URL}/GetCustomersList`,
      );

      const responseText = await response.text();

      console.log(
        'GET CUSTOMERS STATUS:',
        response.status,
      );

      console.log(
        'GET CUSTOMERS RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      const data = JSON.parse(responseText);

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        'GET CUSTOMERS ERROR:',
        error,
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load customers.',
      );
    }
  };

  const handleInputChange = (key, value) => {
    setUpdatedOrder(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateOrder = async () => {
    try {
      const orderId = Number(updatedOrder.orderId);
      const customerId = Number(
        updatedOrder.customerId,
      );

      const date = String(
        updatedOrder.date ?? '',
      ).trim();

      const amount = Number(
        updatedOrder.amount,
      );

      if (!orderId || isNaN(orderId)) {
        Alert.alert(
          'Validation Error',
          'Order ID is invalid.',
        );
        return;
      }

      if (!customerId || isNaN(customerId)) {
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

      if (
        updatedOrder.amount === '' ||
        isNaN(amount) ||
        amount < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Amount must be a valid number.',
        );
        return;
      }

      const payload = {
        orderId,
        customerId,
        date: `${date}T00:00:00`,
        amount,
      };

      console.log(
        'UPDATE SALES PAYLOAD:',
        payload,
      );

      const response = await fetch(
        `${API_URL}/updateOrder`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();

      console.log(
        'UPDATE SALES STATUS:',
        response.status,
      );

      console.log(
        'UPDATE SALES RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      Alert.alert(
        'Success',
        'Order updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'UPDATE SALES ERROR:',
        error,
      );

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

      <TextInput
        style={styles.input}
        placeholder="Order ID"
        value={String(
          updatedOrder.orderId ?? '',
        )}
        editable={false}
      />

      <Text style={styles.label}>
        Customer
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={updatedOrder.customerId}
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

          {customers.map(customer => (
            <Picker.Item
              key={String(customer.customerID)}
              label={`${customer.name} (${customer.customerID})`}
              value={String(customer.customerID)}
            />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={updatedOrder.date}
        onChangeText={value =>
          handleInputChange('date', value)
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={String(
          updatedOrder.amount ?? '',
        )}
        onChangeText={value =>
          handleInputChange('amount', value)
        }
        keyboardType="decimal-pad"
      />

      <View style={styles.button}>
        <Button
          title="Update Order"
          onPress={handleUpdateOrder}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Cancel"
          color="gray"
          onPress={() => navigation.goBack()}
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

  button: {
    marginTop: 10,
  },
});

export default EditSales;