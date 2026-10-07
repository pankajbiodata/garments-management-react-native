import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Vendor';

const EditVendor = ({route, navigation}) => {

  // Get vendor passed from VendorScreen
  const {id, vendor} = route.params;

  const [updatedVendor, setUpdatedVendor] = useState({
    vendorID: vendor.vendorID || id || '',
    name: vendor.name || '',
    contact: vendor.contact || '',
    address: vendor.address || '',
    transactions:
      vendor.transactions != null
        ? String(vendor.transactions)
        : '0',
  });

  // Handle input changes
  const handleInputChange = (key, value) => {
    setUpdatedVendor(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update vendor
  const handleUpdateVendor = async () => {
    try {
      const vendorID = Number(
        updatedVendor.vendorID,
      );

      const name = String(
        updatedVendor.name ?? '',
      ).trim();

      const contact = String(
        updatedVendor.contact ?? '',
      ).trim();

      const address = String(
        updatedVendor.address ?? '',
      ).trim();

      if (!vendorID || isNaN(vendorID)) {
        Alert.alert(
          'Validation Error',
          'Vendor ID is invalid.',
        );
        return;
      }

      if (!name) {
        Alert.alert(
          'Validation Error',
          'Vendor Name is required.',
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
        updatedVendor.transactions === '' ||
        updatedVendor.transactions == null
          ? 0
          : Number(updatedVendor.transactions);

      if (isNaN(transactions)) {
        Alert.alert(
          'Validation Error',
          'Transactions must be a number.',
        );
        return;
      }

      const payload = {
        vendorID: vendorID,
        name: name,
        contact: contact,
        address: address,
        transactions: transactions,
      };

      console.log(
        'UPDATE VENDOR PAYLOAD:',
      );

      console.log(
        JSON.stringify(payload, null, 2),
      );

      const response = await fetch(
        `${API_URL}/UpdateVendor/${encodeURIComponent(
          String(vendorID),
        )}`,
        {
          method: 'PUT',
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

      Alert.alert(
        'Success',
        'Vendor updated successfully.',
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
        'UPDATE VENDOR ERROR:',
        error,
      );

      Alert.alert(
        'Update Error',
        error?.message ||
          'Unable to update vendor.',
      );
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Edit Vendor
      </Text>

      {/* Vendor ID */}

      <TextInput
        style={styles.input}
        placeholder="Vendor ID"
        value={String(
          updatedVendor.vendorID ?? '',
        )}
        editable={false}
      />

      {/* Name */}

      <TextInput
        style={styles.input}
        placeholder="Vendor Name"
        value={updatedVendor.name}
        onChangeText={value =>
          handleInputChange(
            'name',
            value,
          )
        }
      />

      {/* Contact */}

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={updatedVendor.contact}
        onChangeText={value =>
          handleInputChange(
            'contact',
            value,
          )
        }
        keyboardType="phone-pad"
      />

      {/* Address */}

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={updatedVendor.address}
        onChangeText={value =>
          handleInputChange(
            'address',
            value,
          )
        }
      />

      {/* Transactions */}

      <TextInput
        style={styles.input}
        placeholder="Transactions"
        value={String(
          updatedVendor.transactions ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'transactions',
            value,
          )
        }
        keyboardType="numeric"
      />

      {/* Update button */}

      <View style={styles.button}>
        <Button
          title="Update Vendor"
          onPress={handleUpdateVendor}
        />
      </View>

      {/* Cancel button */}

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

  button: {
    marginTop: 10,
  },

});

export default EditVendor;