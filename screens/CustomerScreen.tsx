import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

import {
  apiGet,
  apiPost,
  apiDelete,
} from '../services/api';

const CustomerScreen = ({navigation}) => {
  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    address: '',
    transactions: '0',
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleInputChange = (key, value) => {
    setCustomer(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // =========================================================
  // GET CUSTOMERS
  // =========================================================

  const loadCustomers = async () => {
    try {
      setLoading(true);

      console.log('Loading customers...');

      const data = await apiGet(
        '/Customer/GetCustomersList',
      );

      console.log(
        'Customers API response:',
        data,
      );

      setCustomers(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'Load customers error:',
        error,
      );

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message ||
            'Unable to load customers',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // =========================================================
  // ADD CUSTOMER
  // =========================================================

  const handleAddCustomer = async () => {
    try {
      if (!customer.name.trim()) {
        Alert.alert(
          'Validation',
          'Customer name is required.',
        );
        return;
      }

      if (!customer.contact.trim()) {
        Alert.alert(
          'Validation',
          'Customer contact is required.',
        );
        return;
      }

      if (!customer.address.trim()) {
        Alert.alert(
          'Validation',
          'Customer address is required.',
        );
        return;
      }

      const transactions =
        customer.transactions === '' ||
        customer.transactions == null
          ? 0
          : Number(customer.transactions);

      if (Number.isNaN(transactions)) {
        Alert.alert(
          'Validation',
          'Transactions must be a number.',
        );
        return;
      }

      if (transactions < 0) {
        Alert.alert(
          'Validation',
          'Transactions cannot be negative.',
        );
        return;
      }

      const payload = {
        name: customer.name.trim(),
        contact: customer.contact.trim(),
        address: customer.address.trim(),
        transactions: transactions,
      };

      console.log(
        'ADD CUSTOMER PAYLOAD:',
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );

      await apiPost(
        '/Customer/AddCustomer',
        payload,
      );

      console.log(
        'Customer added successfully.',
      );

      // Reload list
      await loadCustomers();

      // Clear form
      setCustomer({
        name: '',
        contact: '',
        address: '',
        transactions: '0',
      });

      Alert.alert(
        'Success',
        'Customer added successfully.',
      );
    } catch (error) {
      console.error(
        'Add customer error:',
        error,
      );

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message ||
            'Unable to add customer.',
        );
      }
    }
  };

  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDeleteCustomer = id => {
    Alert.alert(
      'Delete Customer',
      'Are you sure you want to delete this customer?',
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
              console.log(
                'Deleting customer:',
                id,
              );

              await apiDelete(
                `/Customer/DeleteCustomer/${encodeURIComponent(
                  String(id),
                )}`,
              );

              setCustomers(prev =>
                prev.filter(
                  item =>
                    String(
                      item.customerID,
                    ) !== String(id),
                ),
              );

              Alert.alert(
                'Success',
                'Customer deleted successfully.',
              );
            } catch (error) {
              console.error(
                'Delete customer error:',
                error,
              );

              if (
                error.message ===
                'SESSION_EXPIRED'
              ) {
                Alert.alert(
                  'Session Expired',
                  'Please login again.',
                );
              } else {
                Alert.alert(
                  'Error',
                  error.message ||
                    'Unable to delete customer.',
                );
              }
            }
          },
        },
      ],
    );
  };

  // =========================================================
  // CUSTOMER ROW
  // =========================================================

  const renderCustomer = ({item}) => {
    return (
      <View style={styles.customerRow}>

        <Text style={styles.nameCell}>
          {item.name}
        </Text>

        <Text style={styles.contactCell}>
          {item.contact}
        </Text>

        <Text style={styles.addressCell}>
          {item.address}
        </Text>

        <Text style={styles.transactionCell}>
          {item.transactions ?? 0}
        </Text>

        <View style={styles.buttonCell}>
          <Button
            title="Edit"
            onPress={() =>
              navigation.navigate(
                'EditCustomer',
                {
                  id: item.customerID,
                  customer: item,
                },
              )
            }
          />
        </View>

        <View style={styles.buttonCell}>
          <Button
            title="Delete"
            color="red"
            onPress={() =>
              handleDeleteCustomer(
                item.customerID,
              )
            }
          />
        </View>

      </View>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Customer List
      </Text>

      {/* ADD CUSTOMER FORM */}

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Customer Name *"
          value={customer.name}
          onChangeText={value =>
            handleInputChange(
              'name',
              value,
            )
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number *"
          value={customer.contact}
          onChangeText={value =>
            handleInputChange(
              'contact',
              value,
            )
          }
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Address *"
          value={customer.address}
          onChangeText={value =>
            handleInputChange(
              'address',
              value,
            )
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Transactions"
          value={customer.transactions}
          onChangeText={value =>
            handleInputChange(
              'transactions',
              value,
            )
          }
          keyboardType="numeric"
        />

        <Button
          title="Add Customer"
          onPress={handleAddCustomer}
        />

      </View>

      {/* CUSTOMER LIST */}

      <View style={styles.table}>

        <View style={styles.customerHeader}>

          <Text style={styles.nameHeader}>
            Name
          </Text>

          <Text style={styles.contactHeader}>
            Contact
          </Text>

          <Text style={styles.addressHeader}>
            Address
          </Text>

          <Text style={styles.transactionHeader}>
            Transactions
          </Text>

          <Text style={styles.actionHeader}>
            Edit
          </Text>

          <Text style={styles.actionHeader}>
            Delete
          </Text>

        </View>

        {loading ? (
          <Text style={styles.emptyText}>
            Loading customers...
          </Text>
        ) : (
          <FlatList
            data={customers}
            keyExtractor={(item, index) =>
              String(
                item.customerID ?? index,
              )
            }
            renderItem={renderCustomer}
            refreshing={loading}
            onRefresh={loadCustomers}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No customers found
              </Text>
            }
          />
        )}

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
    marginBottom: 15,
  },

  inputContainer: {
    marginBottom: 15,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 5,
  },

  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  customerHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 50,
    alignItems: 'center',
  },

  customerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    minHeight: 60,
    alignItems: 'center',
  },

  nameHeader: {
    flex: 1.3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  contactHeader: {
    flex: 1.3,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  addressHeader: {
    flex: 2,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  transactionHeader: {
    flex: 1,
    paddingHorizontal: 5,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  actionHeader: {
    width: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  nameCell: {
    flex: 1.3,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  contactCell: {
    flex: 1.3,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  addressCell: {
    flex: 2,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  transactionCell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 16,
    textAlign: 'center',
  },

  buttonCell: {
    width: 80,
    paddingHorizontal: 4,
  },

  emptyText: {
    textAlign: 'center',
    padding: 30,
    fontSize: 16,
  },
});

export default CustomerScreen;
