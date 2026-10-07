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

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Customer';

const CustomerScreen = ({navigation}) => {
  const [customer, setCustomer] = useState({
    name: '',
    contact: '',
    address: '',
    transactions: '0',
  });

  const [customers, setCustomers] = useState([]);

  // Handle input
  const handleInputChange = (key, value) => {
    setCustomer(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // GET customers
  const loadCustomers = async () => {
    try {
      const response = await fetch(
        `${API_URL}/GetCustomersList`,
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('Customers:', data);

      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Load customers error:', error);

      Alert.alert(
        'Error',
        'Unable to load customers',
      );
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // ADD customer
  const handleAddCustomer = async () => {
    try {
      if (
        !customer.name.trim() ||
        !customer.contact.trim() ||
        !customer.address.trim()
      ) {
        Alert.alert(
          'Validation',
          'Name, Contact and Address are required',
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/AddCustomer`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: customer.name.trim(),
            contact: customer.contact.trim(),
            address: customer.address.trim(),
            transactions:
              Number(customer.transactions) || 0,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          'Add customer response:',
          errorText,
        );

        throw new Error(
          `HTTP ${response.status}`,
        );
      }

      const data = await response.json();

      console.log('Add customer response:', data);

      // API returns only Message, so reload the list
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
        'Customer added successfully',
      );
    } catch (error) {
      console.error(
        'Add customer error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to add customer',
      );
    }
  };

  // DELETE customer
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
              const response = await fetch(
                `${API_URL}/DeleteCustomer/${id}`,
                {
                  method: 'DELETE',
                },
              );

              if (!response.ok) {
                const errorText =
                  await response.text();

                console.error(
                  'Delete response:',
                  errorText,
                );

                throw new Error(
                  `HTTP ${response.status}`,
                );
              }

              // Remove from screen
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
                'Customer deleted successfully',
              );
            } catch (error) {
              console.error(
                'Delete customer error:',
                error,
              );

              Alert.alert(
                'Error',
                'Unable to delete customer',
              );
            }
          },
        },
      ],
    );
  };

  // Customer row
  const renderCustomer = ({item}) => {
    return (
      <View style={styles.customerRow}>

        {/* NAME */}
        <Text style={styles.nameCell}>
          {item.name}
        </Text>

        {/* CONTACT */}
        <Text style={styles.contactCell}>
          {item.contact}
        </Text>

        {/* ADDRESS */}
        <Text style={styles.addressCell}>
          {item.address}
        </Text>

        {/* TRANSACTIONS */}
        <Text style={styles.transactionCell}>
          {item.transactions ?? 0}
        </Text>

        {/* EDIT */}
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

        {/* DELETE */}
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

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Customer List
      </Text>

      {/* ADD CUSTOMER FORM */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Customer Name"
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
          placeholder="Contact Number"
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
          placeholder="Address"
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

        {/* HEADER */}
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

        {/* DATA */}
        <FlatList
          data={customers}
          keyExtractor={(item, index) =>
            String(
              item.customerID ?? index,
            )
          }
          renderItem={renderCustomer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No customers found
            </Text>
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