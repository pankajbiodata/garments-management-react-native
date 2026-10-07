import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Purchase';

const VENDOR_API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Vendor';

const EditPurchase = ({ route, navigation }) => {
  const { id, purchase } = route.params;

  const [vendors, setVendors] = useState([]);

  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseID: id,
    vendorID: purchase?.vendorID ?? '',
    date: purchase?.date
      ? String(purchase.date).substring(0, 10)
      : '',
    amount: purchase?.amount != null
      ? String(purchase.amount)
      : '',
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await fetch(
        `${VENDOR_API_URL}/GetVendorList`
      );

      if (!response.ok) {
        throw new Error('Failed to load vendors');
      }

      const data = await response.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Vendor load error:', error);
      Alert.alert('Error', 'Unable to load vendors.');
    }
  };

  const updatePurchase = async () => {
    if (!purchaseOrder.vendorID) {
      Alert.alert('Validation', 'Please select a vendor.');
      return;
    }

    if (!purchaseOrder.date) {
      Alert.alert('Validation', 'Please enter purchase date.');
      return;
    }

    if (!purchaseOrder.amount) {
      Alert.alert('Validation', 'Please enter amount.');
      return;
    }

    const amount = Number(purchaseOrder.amount);

    if (Number.isNaN(amount) || amount < 0) {
      Alert.alert('Validation', 'Amount must be a valid number.');
      return;
    }

    const payload = {
      purchaseID: Number(purchaseOrder.purchaseID),
      vendorID: Number(purchaseOrder.vendorID),
      date: `${purchaseOrder.date}T00:00:00`,
      amount: amount,
    };

    console.log('Update Purchase Payload:', payload);

    try {
      const response = await fetch(
        `${API_URL}/UpdatePurchaseOrder/${encodeURIComponent(
          String(id)
        )}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const text = await response.text();

      console.log('Update response:', response.status, text);

      if (!response.ok) {
        throw new Error(text || 'Failed to update purchase order');
      }

      Alert.alert(
        'Success',
        'Purchase order updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Update purchase error:', error);

      Alert.alert(
        'Error',
        error.message || 'Unable to update purchase order.'
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Purchase ID</Text>

      <TextInput
        style={[styles.input, styles.readOnly]}
        value={String(purchaseOrder.purchaseID)}
        editable={false}
      />

      <Text style={styles.label}>Vendor</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={purchaseOrder.vendorID}
          onValueChange={(value) =>
            setPurchaseOrder({
              ...purchaseOrder,
              vendorID: value,
            })
          }
        >
          <Picker.Item
            label="Select Vendor"
            value=""
          />

          {vendors.map((vendor) => (
            <Picker.Item
              key={vendor.vendorID}
              label={`${vendor.name} (${vendor.contact})`}
              value={vendor.vendorID}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Date</Text>

      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={purchaseOrder.date}
        onChangeText={(text) =>
          setPurchaseOrder({
            ...purchaseOrder,
            date: text,
          })
        }
      />

      <Text style={styles.label}>Amount</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="decimal-pad"
        value={purchaseOrder.amount}
        onChangeText={(text) =>
          setPurchaseOrder({
            ...purchaseOrder,
            amount: text,
          })
        }
      />

      <View style={styles.buttonContainer}>
        <Button
          title="Update Purchase"
          onPress={updatePurchase}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  readOnly: {
    backgroundColor: '#eee',
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },

  buttonContainer: {
    marginTop: 25,
  },
});

export default EditPurchase;