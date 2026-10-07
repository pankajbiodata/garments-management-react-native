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
  'https://3b36-49-205-47-35.ngrok-free.app/api/Vendor';

const VendorScreen = ({navigation}) => {
  const [vendor, setVendor] = useState({
    name: '',
    contact: '',
    address: '',
    transactions: '0',
  });

  const [vendors, setVendors] = useState([]);

  // Handle input
  const handleInputChange = (key, value) => {
    setVendor(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // GET vendors
  const loadVendors = async () => {
    try {
      const response = await fetch(
        `${API_URL}/GetVendorList`,
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          'Load vendors response:',
          errorText,
        );

        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      console.log('Vendors:', data);

      setVendors(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'Load vendors error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to load vendors',
      );
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  // ADD vendor
  const handleAddVendor = async () => {
    try {
      if (
        !vendor.name.trim() ||
        !vendor.contact.trim() ||
        !vendor.address.trim()
      ) {
        Alert.alert(
          'Validation',
          'Name, Contact and Address are required',
        );
        return;
      }

      const transactions =
        vendor.transactions === '' ||
        vendor.transactions == null
          ? 0
          : Number(vendor.transactions);

      if (isNaN(transactions)) {
        Alert.alert(
          'Validation',
          'Transactions must be a number',
        );
        return;
      }

      const payload = {
        name: vendor.name.trim(),
        contact: vendor.contact.trim(),
        address: vendor.address.trim(),
        transactions: transactions,
      };

      console.log(
        'ADD VENDOR PAYLOAD:',
        JSON.stringify(payload, null, 2),
      );

      const response = await fetch(
        `${API_URL}/AddVendor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      const responseText =
        await response.text();

      console.log(
        'HTTP STATUS:',
        response.status,
      );

      console.log(
        'SERVER RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      // Controller returns Message,
      // therefore reload list.
      await loadVendors();

      setVendor({
        name: '',
        contact: '',
        address: '',
        transactions: '0',
      });

      Alert.alert(
        'Success',
        'Vendor added successfully',
      );
    } catch (error) {
      console.error(
        'Add vendor error:',
        error,
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to add vendor',
      );
    }
  };

  // DELETE vendor
  const handleDeleteVendor = id => {
    Alert.alert(
      'Delete Vendor',
      'Are you sure you want to delete this vendor?',
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
                `${API_URL}/DeleteVendor/${id}`,
                {
                  method: 'DELETE',
                  headers: {
                    Accept: 'application/json',
                  },
                },
              );

              const responseText =
                await response.text();

              console.log(
                'DELETE STATUS:',
                response.status,
              );

              console.log(
                'DELETE RESPONSE:',
                responseText,
              );

              if (!response.ok) {
                throw new Error(
                  `HTTP ${response.status}: ${responseText}`,
                );
              }

              setVendors(prev =>
                prev.filter(
                  item =>
                    String(
                      item.vendorID,
                    ) !== String(id),
                ),
              );

              Alert.alert(
                'Success',
                'Vendor deleted successfully',
              );
            } catch (error) {
              console.error(
                'Delete vendor error:',
                error,
              );

              Alert.alert(
                'Error',
                'Unable to delete vendor',
              );
            }
          },
        },
      ],
    );
  };

  // Vendor row
  const renderVendor = ({item}) => {
    return (
      <View style={styles.vendorRow}>

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
                'EditVendor',
                {
                  id: item.vendorID,
                  vendor: item,
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
              handleDeleteVendor(
                item.vendorID,
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
        Vendor List
      </Text>

      {/* ADD VENDOR FORM */}
      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Vendor Name"
          value={vendor.name}
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
          value={vendor.contact}
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
          value={vendor.address}
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
          value={vendor.transactions}
          onChangeText={value =>
            handleInputChange(
              'transactions',
              value,
            )
          }
          keyboardType="numeric"
        />

        <Button
          title="Add Vendor"
          onPress={handleAddVendor}
        />

      </View>

      {/* VENDOR LIST */}
      <View style={styles.table}>

        {/* HEADER */}
        <View style={styles.vendorHeader}>

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
          data={vendors}
          keyExtractor={(item, index) =>
            String(
              item.vendorID ?? index,
            )
          }
          renderItem={renderVendor}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              No vendors found
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

  vendorHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 50,
    alignItems: 'center',
  },

  vendorRow: {
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

export default VendorScreen;