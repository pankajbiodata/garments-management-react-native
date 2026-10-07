import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/sales';

const CUSTOMER_API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Customer';

const SalesScreen = ({navigation}) => {
  const [order, setOrder] = useState({
    customerId: '',
    date: '',
    amount: '',
  });

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadSales();
    loadCustomers();
  }, []);

  // Get all customers
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

      if (response.status === 404) {
        setCustomers([]);
        return;
      }

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

  // Get all sales
  const loadSales = async () => {
    try {
      const response = await fetch(
        `${API_URL}/getAll`,
      );

      const responseText = await response.text();

      console.log(
        'GET SALES STATUS:',
        response.status,
      );

      console.log(
        'GET SALES RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      const data = JSON.parse(responseText);

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('GET SALES ERROR:', error);

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load sales orders.',
      );
    }
  };

  // Add sales order
  const handleAddOrder = async () => {
    try {
      const customerId = Number(order.customerId);

      if (!order.customerId || isNaN(customerId)) {
        Alert.alert(
          'Validation Error',
          'Please select a customer.',
        );
        return;
      }

      if (!order.date.trim()) {
        Alert.alert(
          'Validation Error',
          'Date is required.',
        );
        return;
      }

      const amount = Number(order.amount);

      if (
        order.amount === '' ||
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
        customerId,
        date: `${order.date}T00:00:00`,
        amount,
      };

      console.log(
        'ADD SALES PAYLOAD:',
        payload,
      );

      const response = await fetch(
        `${API_URL}/addOrder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText = await response.text();

      console.log(
        'ADD SALES STATUS:',
        response.status,
      );

      console.log(
        'ADD SALES RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      Alert.alert(
        'Success',
        'Order added successfully.',
      );

      setOrder({
        customerId: '',
        date: '',
        amount: '',
      });

      loadSales();
    } catch (error) {
      console.error(
        'ADD SALES ERROR:',
        error,
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to add sales order.',
      );
    }
  };

  // Delete sales order
  const handleDeleteOrder = orderId => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this sales order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_URL}/deleteOrder/${encodeURIComponent(
                  String(orderId),
                )}`,
                {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/json',
                  },
                },
              );

              const responseText =
                await response.text();

              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${responseText}`,
                );
              }

              Alert.alert(
                'Success',
                'Order deleted successfully.',
              );

              loadSales();
            } catch (error) {
              console.error(
                'DELETE SALES ERROR:',
                error,
              );

              Alert.alert(
                'Error',
                error?.message ||
                  'Unable to delete order.',
              );
            }
          },
        },
      ],
    );
  };

  const formatDate = value => {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString();
  };

  const getCustomerName = customerId => {
    const customer = customers.find(
      c =>
        Number(c.customerID) ===
        Number(customerId),
    );

    return customer
      ? customer.name
      : String(customerId);
  };

  // Render sales order
  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>
        {item.orderId}
      </Text>

      <Text style={styles.customerCell}>
        {getCustomerName(item.customerId)}
      </Text>

      <Text style={styles.cell}>
        {formatDate(item.date)}
      </Text>

      <Text style={styles.cell}>
        ₹{Number(item.amount).toFixed(2)}
      </Text>

      <View style={styles.actionCell}>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate('EditSales', {
              id: item.orderId,
              order: item,
            })
          }
        />
      </View>

      <View style={styles.actionCell}>
        <Button
          title="Delete"
          color="red"
          onPress={() =>
            handleDeleteOrder(item.orderId)
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Sales Management
      </Text>

      {/* Customer Dropdown */}

      <Text style={styles.label}>
        Customer
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={order.customerId}
          onValueChange={value =>
            setOrder(prev => ({
              ...prev,
              customerId: value,
            }))
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
        value={order.date}
        onChangeText={value =>
          setOrder(prev => ({
            ...prev,
            date: value,
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={order.amount}
        onChangeText={value =>
          setOrder(prev => ({
            ...prev,
            amount: value,
          }))
        }
        keyboardType="decimal-pad"
      />

      <View style={styles.addButton}>
        <Button
          title="Add Sales Order"
          onPress={handleAddOrder}
        />
      </View>

      {/* Table Header */}

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>
          Order ID
        </Text>

        <Text style={styles.headerCell}>
          Customer
        </Text>

        <Text style={styles.headerCell}>
          Date
        </Text>

        <Text style={styles.headerCell}>
          Amount
        </Text>

        <Text style={styles.headerCell}>
          Edit
        </Text>

        <Text style={styles.headerCell}>
          Delete
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item =>
          String(item.orderId)
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No sales orders found.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
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
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  addButton: {
    marginBottom: 15,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    backgroundColor: '#eee',
    minHeight: 45,
  },

  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 55,
  },

  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
  },

  customerCell: {
    flex: 1.5,
    textAlign: 'center',
    padding: 5,
  },

  actionCell: {
    flex: 1,
    paddingHorizontal: 3,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#777',
  },
});

export default SalesScreen;