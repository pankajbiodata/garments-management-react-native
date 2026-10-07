import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {apiGet, apiPut} from '../services/api';

const EditPurchase = ({route, navigation}) => {
  const {id, purchase} = route.params || {};

  const [vendors, setVendors] = useState([]);

  const [purchaseOrder, setPurchaseOrder] = useState({
    purchaseID: id ?? '',
    vendorID: purchase?.vendorID ?? '',
    date: purchase?.date
      ? String(purchase.date).substring(0, 10)
      : '',
    amount:
      purchase?.amount != null
        ? String(purchase.amount)
        : '',
  });

  useEffect(() => {
    loadVendors();
  }, []);

  // -----------------------------------------
  // Session expired
  // -----------------------------------------
  const handleSessionExpired = () => {
    Alert.alert(
      'Session Expired',
      'Please login again.',
      [
        {
          text: 'OK',
          onPress: () =>
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            }),
        },
      ],
    );
  };

  // -----------------------------------------
  // Load vendors
  // -----------------------------------------
  const loadVendors = async () => {
    try {
      const data = await apiGet(
        '/Vendor/GetVendorList',
      );

      console.log(
        'GET VENDORS RESPONSE:',
        data,
      );

      setVendors(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'Vendor load error:',
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
          'Unable to load vendors.',
      );
    }
  };

  // -----------------------------------------
  // Update purchase order
  // -----------------------------------------
  const updatePurchase = async () => {
    try {
      const purchaseID = Number(
        purchaseOrder.purchaseID,
      );

      // Purchase ID validation
      if (
        !purchaseOrder.purchaseID ||
        Number.isNaN(purchaseID) ||
        purchaseID <= 0
      ) {
        Alert.alert(
          'Validation',
          'Invalid purchase ID.',
        );
        return;
      }

      // Vendor validation
      const vendorID = Number(
        purchaseOrder.vendorID,
      );

      if (
        !purchaseOrder.vendorID ||
        Number.isNaN(vendorID) ||
        vendorID <= 0
      ) {
        Alert.alert(
          'Validation',
          'Please select a vendor.',
        );
        return;
      }

      // Date validation
      const date = String(
        purchaseOrder.date ?? '',
      ).trim();

      if (!date) {
        Alert.alert(
          'Validation',
          'Please enter purchase date.',
        );
        return;
      }

      const dateRegex =
        /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(date)) {
        Alert.alert(
          'Validation',
          'Date must be in YYYY-MM-DD format.',
        );
        return;
      }

      // Amount validation
      const amount = Number(
        purchaseOrder.amount,
      );

      if (
        purchaseOrder.amount === '' ||
        Number.isNaN(amount) ||
        amount < 0
      ) {
        Alert.alert(
          'Validation',
          'Amount must be a valid non-negative number.',
        );
        return;
      }

      const payload = {
        purchaseID: purchaseID,
        vendorID: vendorID,
        date: `${date}T00:00:00`,
        amount: amount,
      };

      console.log(
        'UPDATE PURCHASE PAYLOAD:',
        payload,
      );

      await apiPut(
        `/Purchase/UpdatePurchaseOrder/${encodeURIComponent(
          String(purchaseID),
        )}`,
        payload,
      );

      Alert.alert(
        'Success',
        'Purchase order updated successfully.',
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
        'Update purchase error:',
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
          'Unable to update purchase order.',
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }>
      
      {/* Purchase ID */}

      <Text style={styles.label}>
        Purchase ID
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.readOnly,
        ]}
        value={String(
          purchaseOrder.purchaseID,
        )}
        editable={false}
      />

      {/* Vendor */}

      <Text style={styles.label}>
        Vendor
      </Text>

      <View
        style={
          styles.pickerContainer
        }>
        <Picker
          selectedValue={
            purchaseOrder.vendorID
          }
          onValueChange={value =>
            setPurchaseOrder(prev => ({
              ...prev,
              vendorID: value,
            }))
          }>
          
          <Picker.Item
            label="Select Vendor"
            value=""
          />

          {vendors.map(vendor => (
            <Picker.Item
              key={String(
                vendor.vendorID,
              )}
              label={`${vendor.name} (${vendor.contact})`}
              value={String(
                vendor.vendorID,
              )}
            />
          ))}
        </Picker>
      </View>

      {/* Date */}

      <Text style={styles.label}>
        Date
      </Text>

      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={purchaseOrder.date}
        onChangeText={text =>
          setPurchaseOrder(prev => ({
            ...prev,
            date: text,
          }))
        }
      />

      {/* Amount */}

      <Text style={styles.label}>
        Amount
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="decimal-pad"
        value={purchaseOrder.amount}
        onChangeText={text =>
          setPurchaseOrder(prev => ({
            ...prev,
            amount: text,
          }))
        }
      />

      {/* Update */}

      <View
        style={
          styles.buttonContainer
        }>
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
