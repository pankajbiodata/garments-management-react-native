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
import {apiGet, apiPost} from '../services/api';

const PurchaseScreen = ({navigation}) => {
  const [purchase, setPurchase] = useState({
    vendorID: '',
    date: '',
    amount: '',
  });

  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    loadPurchases();
    loadVendors();
  }, []);

  // -----------------------------------------
  // Load vendors
  // -----------------------------------------
  const loadVendors = async () => {
    try {
      const data = await apiGet('/Vendor/GetVendorList');

      console.log('GET VENDORS RESPONSE:', data);

      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('GET VENDORS ERROR:', error);

      if (error?.message === 'SESSION_EXPIRED') {
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
        return;
      }

      Alert.alert(
        'Error',
        error?.message || 'Unable to load vendors.',
      );
    }
  };

  // -----------------------------------------
  // Load purchase orders
  // -----------------------------------------
  const loadPurchases = async () => {
    try {
      const data = await apiGet('/Purchase/GetPurchaseReport');

      console.log('GET PURCHASE RESPONSE:', data);

      setPurchases(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('GET PURCHASE ERROR:', error);

      if (error?.message === 'SESSION_EXPIRED') {
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
        return;
      }

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load purchase orders.',
      );
    }
  };

  // -----------------------------------------
  // Get vendor name
  // -----------------------------------------
  const getVendorName = vendorID => {
    const vendor = vendors.find(
      v =>
        Number(v.vendorID) ===
        Number(vendorID),
    );

    return vendor
      ? vendor.name
      : String(vendorID ?? '');
  };

  // -----------------------------------------
  // Add purchase order
  // -----------------------------------------
  const handleAddPurchase = async () => {
    try {
      const vendorID = Number(
        purchase.vendorID,
      );

      // Vendor validation
      if (
        !purchase.vendorID ||
        Number.isNaN(vendorID) ||
        vendorID <= 0
      ) {
        Alert.alert(
          'Validation Error',
          'Please select a vendor.',
        );
        return;
      }

      // Date validation
      const date = String(
        purchase.date ?? '',
      ).trim();

      if (!date) {
        Alert.alert(
          'Validation Error',
          'Date is required.',
        );
        return;
      }

      // Validate YYYY-MM-DD
      const dateRegex =
        /^\d{4}-\d{2}-\d{2}$/;

      if (!dateRegex.test(date)) {
        Alert.alert(
          'Validation Error',
          'Date must be in YYYY-MM-DD format.',
        );
        return;
      }

      // Amount validation
      const amount = Number(
        purchase.amount,
      );

      if (
        purchase.amount === '' ||
        Number.isNaN(amount) ||
        amount < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Amount must be a valid non-negative number.',
        );
        return;
      }

      const payload = {
        vendorID: vendorID,
        date: `${date}T00:00:00`,
        amount: amount,
      };

      console.log(
        'ADD PURCHASE PAYLOAD:',
        payload,
      );

      await apiPost(
        '/Purchase/AddPurchaseOrder',
        payload,
      );

      Alert.alert(
        'Success',
        'Purchase order added successfully.',
      );

      setPurchase({
        vendorID: '',
        date: '',
        amount: '',
      });

      loadPurchases();
    } catch (error) {
      console.error(
        'ADD PURCHASE ERROR:',
        error,
      );

      if (error?.message === 'SESSION_EXPIRED') {
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
        return;
      }

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to add purchase order.',
      );
    }
  };

  // -----------------------------------------
  // Format date
  // -----------------------------------------
  const formatDate = value => {
    if (!value) {
      return '';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleDateString();
  };

  // -----------------------------------------
  // Render purchase order
  // -----------------------------------------
  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.cell}>
        {item.purchaseID}
      </Text>

      <Text style={styles.vendorCell}>
        {getVendorName(item.vendorID)}
      </Text>

      <Text style={styles.cell}>
        {formatDate(item.date)}
      </Text>

      <Text style={styles.cell}>
        ₹{Number(item.amount || 0).toFixed(2)}
      </Text>

      <View style={styles.actionCell}>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate(
              'EditPurchase',
              {
                id: item.purchaseID,
                purchase: item,
              },
            )
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Purchase Management
      </Text>

      {/* Vendor Dropdown */}

      <Text style={styles.label}>
        Vendor
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={purchase.vendorID}
          onValueChange={value =>
            setPurchase(prev => ({
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
              key={String(vendor.vendorID)}
              label={`${vendor.name} (${vendor.vendorID})`}
              value={String(vendor.vendorID)}
            />
          ))}
        </Picker>
      </View>

      {/* Date */}

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={purchase.date}
        onChangeText={value =>
          setPurchase(prev => ({
            ...prev,
            date: value,
          }))
        }
      />

      {/* Amount */}

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={purchase.amount}
        onChangeText={value =>
          setPurchase(prev => ({
            ...prev,
            amount: value,
          }))
        }
        keyboardType="decimal-pad"
      />

      <View style={styles.addButton}>
        <Button
          title="Add Purchase Order"
          onPress={handleAddPurchase}
        />
      </View>

      {/* Table Header */}

      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>
          Purchase ID
        </Text>

        <Text style={styles.headerCell}>
          Vendor
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
      </View>

      {/* Purchase List */}

      <FlatList
        data={purchases}
        keyExtractor={item =>
          String(item.purchaseID)
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No purchase orders found.
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

  vendorCell: {
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

export default PurchaseScreen;
