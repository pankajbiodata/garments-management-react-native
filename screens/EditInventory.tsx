import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

import {apiPut} from '../services/api';

const EditInventory = ({route, navigation}) => {
  const {id, item} = route.params;

  const [updatedItem, setUpdatedItem] = useState({
    itemID: item?.itemID || id || '',
    name: item?.name || '',
    quantity:
      item?.quantity != null
        ? String(item.quantity)
        : '',
    unitPrice:
      item?.unitPrice != null
        ? String(item.unitPrice)
        : '',
  });

  const handleInputChange = (key, value) => {
    setUpdatedItem(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateItem = async () => {
    try {
      const itemID = Number(
        updatedItem.itemID,
      );

      const name = String(
        updatedItem.name ?? '',
      ).trim();

      // Validate Item ID
      if (
        !Number.isInteger(itemID) ||
        itemID <= 0
      ) {
        Alert.alert(
          'Validation Error',
          'Item ID is invalid.',
        );
        return;
      }

      // Validate Item Name
      if (!name) {
        Alert.alert(
          'Validation Error',
          'Item Name is required.',
        );
        return;
      }

      // Validate Quantity
      if (
        updatedItem.quantity === ''
      ) {
        Alert.alert(
          'Validation Error',
          'Quantity is required.',
        );
        return;
      }

      const quantity = Number(
        updatedItem.quantity,
      );

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

      // Validate Unit Price
      if (
        updatedItem.unitPrice === ''
      ) {
        Alert.alert(
          'Validation Error',
          'Unit Price is required.',
        );
        return;
      }

      const unitPrice = Number(
        updatedItem.unitPrice,
      );

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
        itemID,
        name,
        quantity,
        unitPrice,
      };

      console.log(
        'UPDATE INVENTORY PAYLOAD:',
        payload,
      );

      await apiPut(
        `/Inventory/UpdateItem/${encodeURIComponent(
          String(itemID),
        )}`,
        payload,
      );

      Alert.alert(
        'Success',
        'Item updated successfully.',
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
        'UPDATE INVENTORY ERROR:',
        error,
      );

      // JWT expired
      if (
        error?.message ===
        'SESSION_EXPIRED'
      ) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {name: 'Login'},
                  ],
                });
              },
            },
          ],
        );

        return;
      }

      Alert.alert(
        'Update Error',
        error?.message ||
          'Unable to update inventory item.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Edit Inventory Item
      </Text>

      {/* Item ID - Read Only */}
      <TextInput
        style={styles.input}
        placeholder="Item ID"
        value={String(
          updatedItem.itemID ?? '',
        )}
        editable={false}
      />

      {/* Item Name */}
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={updatedItem.name}
        onChangeText={value =>
          handleInputChange(
            'name',
            value,
          )
        }
      />

      {/* Quantity */}
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={String(
          updatedItem.quantity ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'quantity',
            value,
          )
        }
        keyboardType="numeric"
      />

      {/* Unit Price */}
      <TextInput
        style={styles.input}
        placeholder="Unit Price"
        value={String(
          updatedItem.unitPrice ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'unitPrice',
            value,
          )
        }
        keyboardType="decimal-pad"
      />

      {/* Update */}
      <View style={styles.button}>
        <Button
          title="Update Item"
          onPress={
            handleUpdateItem
          }
        />
      </View>

      {/* Cancel */}
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

export default EditInventory;
