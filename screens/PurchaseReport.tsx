import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

const PURCHASE_API =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Purchase';

const VENDOR_API =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Vendor';

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const [purchaseResponse, vendorResponse] =
        await Promise.all([
          fetch(`${PURCHASE_API}/GetPurchaseReport`),
          fetch(`${VENDOR_API}/GetVendorList`),
        ]);

      if (!purchaseResponse.ok) {
        throw new Error(
          'Failed to load purchase report'
        );
      }

      if (!vendorResponse.ok) {
        throw new Error(
          'Failed to load vendors'
        );
      }

      const purchaseData =
        await purchaseResponse.json();

      const vendorData =
        await vendorResponse.json();

      setPurchases(
        Array.isArray(purchaseData)
          ? purchaseData
          : []
      );

      setVendors(
        Array.isArray(vendorData)
          ? vendorData
          : []
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'Unable to load purchase report.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(
      (v) =>
        Number(v.vendorID) === Number(vendorId)
    );

    return vendor
      ? vendor.name
      : `Vendor ${vendorId}`;
  };

  const renderItem = ({ item }) => {
    const amount = Number(item.amount || 0);

    const date = item.date
      ? String(item.date).substring(0, 10)
      : '';

    return (
      <View style={styles.row}>

        <Text style={[styles.cell, styles.idCell]}>
          {item.purchaseID}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.vendorCell,
          ]}
        >
          {getVendorName(item.vendorID)}
        </Text>

        <Text style={styles.cell}>
          {date}
        </Text>

        <Text style={styles.cell}>
          ₹{amount.toFixed(2)}
        </Text>

      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Loading report...</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View style={styles.container}>

        <Text style={styles.title}>
          Purchase Report
        </Text>

        <View style={styles.header}>

          <Text
            style={[
              styles.headerCell,
              styles.idCell,
            ]}
          >
            Purchase ID
          </Text>

          <Text
            style={[
              styles.headerCell,
              styles.vendorCell,
            ]}
          >
            Vendor
          </Text>

          <Text style={styles.headerCell}>
            Date
          </Text>

          <Text style={styles.headerCell}>
            Amount
          </Text>

        </View>

        <FlatList
          data={purchases}
          keyExtractor={(item) =>
            String(item.purchaseID)
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No purchase orders found.
            </Text>
          }
        />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    minWidth: 600,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  header: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    paddingVertical: 12,
  },

  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
  },

  headerCell: {
    width: 140,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },

  cell: {
    width: 140,
    paddingHorizontal: 8,
  },

  idCell: {
    width: 120,
  },

  vendorCell: {
    width: 220,
  },

  empty: {
    padding: 20,
    textAlign: 'center',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PurchaseReport;