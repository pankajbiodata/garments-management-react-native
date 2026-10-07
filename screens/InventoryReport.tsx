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

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Inventory';

const InventoryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const response = await fetch(
        `${API_URL}/GetInventoryReport`
      );

      if (!response.ok) {
        throw new Error('Failed to load inventory');
      }

      const data = await response.json();

      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Unable to load inventory report.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.idCell]}>
          {item.itemID}
        </Text>

        <Text style={[styles.cell, styles.nameCell]}>
          {item.name}
        </Text>

        <Text style={styles.cell}>
          {quantity}
        </Text>

        <Text style={styles.cell}>
          ₹{unitPrice.toFixed(2)}
        </Text>

        <Text style={styles.cell}>
          ₹{(quantity * unitPrice).toFixed(2)}
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
          Inventory Report
        </Text>

        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.idCell]}>
            ID
          </Text>

          <Text style={[styles.headerCell, styles.nameCell]}>
            Item Name
          </Text>

          <Text style={styles.headerCell}>
            Quantity
          </Text>

          <Text style={styles.headerCell}>
            Unit Price
          </Text>

          <Text style={styles.headerCell}>
            Total Value
          </Text>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) =>
            String(item.itemID)
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No inventory items found.
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
    minWidth: 700,
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
    width: 130,
    fontWeight: 'bold',
    paddingHorizontal: 8,
  },

  cell: {
    width: 130,
    paddingHorizontal: 8,
  },

  idCell: {
    width: 70,
  },

  nameCell: {
    width: 200,
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

export default InventoryReport;