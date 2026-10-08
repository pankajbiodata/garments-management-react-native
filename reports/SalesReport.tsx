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

const SALES_API =
  'https://1dde-49-205-47-35.ngrok-free.app/api/sales';

const CUSTOMER_API =
  'https://1dde-49-205-47-35.ngrok-free.app/api/Customer';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const [salesResponse, customerResponse] =
        await Promise.all([
          fetch(`${SALES_API}/getAll`),
          fetch(`${CUSTOMER_API}/GetCustomersList`),
        ]);

      if (!salesResponse.ok) {
        throw new Error('Failed to load sales');
      }

      if (!customerResponse.ok) {
        throw new Error('Failed to load customers');
      }

      const salesData = await salesResponse.json();
      const customerData = await customerResponse.json();

      setSales(
        Array.isArray(salesData)
          ? salesData
          : []
      );

      setCustomers(
        Array.isArray(customerData)
          ? customerData
          : []
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error',
        'Unable to load sales report.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getCustomerName = (customerId) => {
    const customer = customers.find(
      (c) =>
        Number(c.customerID) === Number(customerId)
    );

    return customer
      ? customer.name
      : `Customer ${customerId}`;
  };

  const renderItem = ({ item }) => {
    const amount = Number(item.amount || 0);

    const date = item.date
      ? String(item.date).substring(0, 10)
      : '';

    return (
      <View style={styles.row}>

        <Text style={[styles.cell, styles.idCell]}>
          {item.orderId}
        </Text>

        <Text style={[styles.cell, styles.customerCell]}>
          {getCustomerName(item.customerId)}
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
          Sales Report
        </Text>

        <View style={styles.header}>

          <Text style={[styles.headerCell, styles.idCell]}>
            Order ID
          </Text>

          <Text
            style={[
              styles.headerCell,
              styles.customerCell,
            ]}
          >
            Customer
          </Text>

          <Text style={styles.headerCell}>
            Date
          </Text>

          <Text style={styles.headerCell}>
            Amount
          </Text>

        </View>

        <FlatList
          data={sales}
          keyExtractor={(item) =>
            String(item.orderId)
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No sales orders found.
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
    width: 100,
  },

  customerCell: {
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

export default SalesReport;