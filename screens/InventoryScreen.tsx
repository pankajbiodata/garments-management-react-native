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

import {
  apiGet,
  apiPost,
  apiDelete,
} from '../services/api';

const InventoryScreen = ({navigation}) => {
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    unitPrice: '',
  });

  const [items, setItems] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  // Handle expired/invalid JWT session
  const handleApiError = error => {
    if (error?.message === 'SESSION_EXPIRED') {
      Alert.alert(
        'Session Expired',
        'Your session has expired. Please login again.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            },
          },
        ],
      );

      return true;
    }

    return false;
  };

  // Get inventory list
  const loadInventory = async () => {
    try {
      const data = await apiGet(
        '/Inventory/GetInventoryReport',
      );

      console.log(
        'GET INVENTORY RESPONSE:',
        data,
      );

      setItems(
        Array.isArray(data)
          ? data
          : [],
      );
    } catch (error) {
      console.error(
        'GET INVENTORY ERROR:',
        error,
      );

      // 404 means there are currently no items
      if (
        error?.message?.includes(
          'No items found in inventory',
        )
      ) {
        setItems([]);
        return;
      }

      if (handleApiError(error)) {
        return;
      }

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load inventory.',
      );
    }
  };

  // Add inventory item
  const handleAddItem = async () => {
    try {
      const name =
        String(item.name ?? '').trim();

      if (!name) {
        Alert.alert(
          'Validation Error',
          'Item Name is required.',
        );
        return;
      }

      if (item.quantity === '') {
        Alert.alert(
          'Validation Error',
          'Quantity is required.',
        );
        return;
      }

      const quantity =
        Number(item.quantity);

      if (
        !Number.isInteger(quantity) ||
        quantity < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Quantity must be a valid whole number.',
        );
        return;
      }

      if (item.unitPrice === '') {
        Alert.alert(
          'Validation Error',
          'Unit Price is required.',
        );
        return;
      }

      const unitPrice =
        Number(item.unitPrice);

      if (
        !Number.isFinite(unitPrice) ||
        unitPrice < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Unit Price must be a valid number.',
        );
        return;
      }

      const payload = {
        name,
        quantity,
        unitPrice,
      };

      console.log(
        'ADD INVENTORY PAYLOAD:',
        payload,
      );

      await apiPost(
        '/Inventory/AddItem',
        payload,
      );

      Alert.alert(
        'Success',
        'Item added successfully.',
      );

      setItem({
        name: '',
        quantity: '',
        unitPrice: '',
      });

      // Reload inventory list
      await loadInventory();
    } catch (error) {
      console.error(
        'ADD INVENTORY ERROR:',
        error,
      );

      if (handleApiError(error)) {
        return;
      }

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to add item.',
      );
    }
  };

  // Delete inventory item
  const handleDeleteItem = id => {
    if (!id) {
      Alert.alert(
        'Error',
        'Invalid inventory item ID.',
      );
      return;
    }

    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
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
              await apiDelete(
                `/Inventory/DeleteItem/${encodeURIComponent(
                  String(id),
                )}`,
              );

              Alert.alert(
                'Success',
                'Item deleted successfully.',
              );

              await loadInventory();
            } catch (error) {
              console.error(
                'DELETE INVENTORY ERROR:',
                error,
              );

              if (handleApiError(error)) {
                return;
              }

              Alert.alert(
                'Error',
                error?.message ||
                  'Unable to delete item.',
              );
            }
          },
        },
      ],
    );
  };

  // Render one inventory row
  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text
        style={[
          styles.cell,
          styles.nameCell,
        ]}>
        {item.name}
      </Text>

      <Text style={styles.cell}>
        {item.quantity}
      </Text>

      <Text style={styles.cell}>
        ₹
        {Number(
          item.unitPrice || 0,
        ).toFixed(2)}
      </Text>

      <View style={styles.actionCell}>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate(
              'EditInventory',
              {
                id: item.itemID,
                item: item,
              },
            )
          }
        />
      </View>

      <View style={styles.actionCell}>
        <Button
          title="Delete"
          color="red"
          onPress={() =>
            handleDeleteItem(
              item.itemID,
            )
          }
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Inventory Management
      </Text>

      {/* Add Item Form */}

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={item.name}
        onChangeText={value =>
          setItem(prev => ({
            ...prev,
            name: value,
          }))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={item.quantity}
        onChangeText={value =>
          setItem(prev => ({
            ...prev,
            quantity: value,
          }))
        }
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={item.unitPrice}
        onChangeText={value =>
          setItem(prev => ({
            ...prev,
            unitPrice: value,
          }))
        }
        keyboardType="decimal-pad"
      />

      <View style={styles.addButton}>
        <Button
          title="Add Item"
          onPress={handleAddItem}
        />
      </View>

      {/* Table Header */}

      <View style={styles.headerRow}>
        <Text
          style={[
            styles.headerCell,
            styles.nameCell,
          ]}>
          Name
        </Text>

        <Text style={styles.headerCell}>
          Qty
        </Text>

        <Text style={styles.headerCell}>
          Unit Price
        </Text>

        <Text style={styles.headerCell}>
          Edit
        </Text>

        <Text style={styles.headerCell}>
          Delete
        </Text>
      </View>

      {/* Inventory List */}

      <FlatList
        data={items}
        keyExtractor={item =>
          String(item.itemID)
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No inventory items found.
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

  nameCell: {
    flex: 1.5,
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

export default InventoryScreen;
