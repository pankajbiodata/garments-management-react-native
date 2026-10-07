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
  'https://3b36-49-205-47-35.ngrok-free.app/api/Purchase';

const VENDOR_API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Vendor';

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

  // Load vendors for dropdown
  const loadVendors = async () => {
    try {
      const response = await fetch(
        `${VENDOR_API_URL}/GetVendorList`,
      );

      const responseText = await response.text();

      console.log(
        'GET VENDORS STATUS:',
        response.status,
      );

      console.log(
        'GET VENDORS RESPONSE:',
        responseText,
      );

      if (response.status === 404) {
        setVendors([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      const data = JSON.parse(responseText);

      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        'GET VENDORS ERROR:',
        error,
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load vendors.',
      );
    }
  };

  // Load purchase orders
  const loadPurchases = async () => {
    try {
      const response = await fetch(
        `${API_URL}/GetPurchaseReport`,
      );

      const responseText = await response.text();

      console.log(
        'GET PURCHASE STATUS:',
        response.status,
      );

      console.log(
        'GET PURCHASE RESPONSE:',
        responseText,
      );

      if (response.status === 404) {
        setPurchases([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

      const data = JSON.parse(responseText);

      setPurchases(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'GET PURCHASE ERROR:',
        error,
      );

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load purchase orders.',
      );
    }
  };

  // Get vendor name
  const getVendorName = vendorID => {
    const vendor = vendors.find(
      v =>
        Number(v.vendorID) ===
        Number(vendorID),
    );

    return vendor
      ? vendor.name
      : String(vendorID);
  };

  // Add purchase order
  const handleAddPurchase = async () => {
    try {
      const vendorID = Number(
        purchase.vendorID,
      );

      if (
        !purchase.vendorID ||
        isNaN(vendorID)
      ) {
        Alert.alert(
          'Validation Error',
          'Please select a vendor.',
        );
        return;
      }

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

      const amount = Number(
        purchase.amount,
      );

      if (
        purchase.amount === '' ||
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
        vendorID,
        date: `${date}T00:00:00`,
        amount,
      };

      console.log(
        'ADD PURCHASE PAYLOAD:',
        payload,
      );

      const response = await fetch(
        `${API_URL}/AddPurchaseOrder`,
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
        'ADD PURCHASE STATUS:',
        response.status,
      );

      console.log(
        'ADD PURCHASE RESPONSE:',
        responseText,
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${responseText}`,
        );
      }

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

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to add purchase order.',
      );
    }
  };

  // Format date
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

  // Render purchase order
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
        ₹{Number(item.amount).toFixed(2)}
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