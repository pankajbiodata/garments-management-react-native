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

import {
  apiGet,
  apiPost,
  apiDelete,
} from '../services/api';

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

  // Get all customers
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

  // Get all sales
  const loadSales = async () => {
    try {
      const data = await apiGet(
        '/sales/getAll',
      );

      console.log(
        'GET SALES RESPONSE:',
        data,
      );

      setOrders(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'GET SALES ERROR:',
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
          'Unable to load sales orders.',
      );
    }
  };

  // Add sales order
  const handleAddOrder = async () => {
    try {
      const customerId = Number(
        order.customerId,
      );

      if (
        !order.customerId ||
        isNaN(customerId) ||
        customerId <= 0
      ) {
        Alert.alert(
          'Validation Error',
          'Please select a customer.',
        );
        return;
      }

      const date = String(
        order.date ?? '',
      ).trim();

      if (!date) {
        Alert.alert(
          'Validation Error',
          'Date is required.',
        );
        return;
      }

      // Basic date validation
      const datePattern =
        /^\d{4}-\d{2}-\d{2}$/;

      if (!datePattern.test(date)) {
        Alert.alert(
          'Validation Error',
          'Date must be in YYYY-MM-DD format.',
        );
        return;
      }

      const amount = Number(
        order.amount,
      );

      if (
        order.amount === '' ||
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
        customerId: customerId,
        date: `${date}T00:00:00`,
        amount: amount,
      };

      console.log(
        'ADD SALES PAYLOAD:',
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      await apiPost(
        '/sales/addOrder',
        payload,
      );

      Alert.alert(
        'Success',
        'Order added successfully.',
      );

      setOrder({
        customerId: '',
        date: '',
        amount: '',
      });

      await loadSales();
    } catch (error) {
      console.error(
        'ADD SALES ERROR:',
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
              await apiDelete(
                `/sales/deleteOrder/${encodeURIComponent(
                  String(orderId),
                )}`,
              );

              Alert.alert(
                'Success',
                'Order deleted successfully.',
              );

              await loadSales();
            } catch (error) {
              console.error(
                'DELETE SALES ERROR:',
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
        {getCustomerName(
          item.customerId,
        )}
      </Text>

      <Text style={styles.cell}>
        {formatDate(item.date)}
      </Text>

      <Text style={styles.cell}>
        ₹
        {Number(
          item.amount,
        ).toFixed(2)}
      </Text>

      <View style={styles.actionCell}>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate(
              'EditSales',
              {
                id: item.orderId,
                order: item,
              },
            )
          }
        />
      </View>

      <View style={styles.actionCell}>
        <Button
          title="Delete"
          color="red"
          onPress={() =>
            handleDeleteOrder(
              item.orderId,
            )
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

      <View
        style={
          styles.pickerContainer
        }>
        <Picker
          selectedValue={
            order.customerId
          }
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
        value={order.date}
        onChangeText={value =>
          setOrder(prev => ({
            ...prev,
            date: value,
          }))
        }
      />

      {/* Amount */}

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

      {/* Add */}

      <View
        style={styles.addButton}>
        <Button
          title="Add Sales Order"
          onPress={
            handleAddOrder
          }
        />
      </View>

      {/* Table Header */}

      <View
        style={styles.headerRow}>
        <Text
          style={
            styles.headerCell
          }>
          Order ID
        </Text>

        <Text
          style={
            styles.headerCell
          }>
          Customer
        </Text>

        <Text
          style={
            styles.headerCell
          }>
          Date
        </Text>

        <Text
          style={
            styles.headerCell
          }>
          Amount
        </Text>

        <Text
          style={
            styles.headerCell
          }>
          Edit
        </Text>

        <Text
          style={
            styles.headerCell
          }>
          Delete
        </Text>
      </View>

      {/* Sales Orders */}

      <FlatList
        data={orders}
        keyExtractor={item =>
          String(item.orderId)
        }
        renderItem={
          renderItem
        }
        ListEmptyComponent={
          <Text
            style={
              styles.emptyText
            }>
            No sales orders
            found.
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
