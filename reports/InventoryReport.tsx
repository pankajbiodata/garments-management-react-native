import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {apiGet} from '../services/api';

const InventoryReport = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadInventory = async () => {
    try {
      setLoading(true);

      console.log('Loading inventory report...');

      const data = await apiGet(
        '/Inventory/GetInventoryReport',
      );

      console.log(
        'Inventory API response:',
        data,
      );

      if (Array.isArray(data)) {
        setItems(data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error(
        'Inventory report error:',
        error,
      );

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message ||
            'Unable to load inventory report.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const totalQuantity = items.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0,
  );

  const totalValue = items.reduce(
    (total, item) => {
      const quantity = Number(
        item.quantity || 0,
      );

      const unitPrice = Number(
        item.unitPrice || 0,
      );

      return total + quantity * unitPrice;
    },
    0,
  );

  const renderItem = ({item, index}) => {
    const quantity = Number(
      item.quantity || 0,
    );

    const unitPrice = Number(
      item.unitPrice || 0,
    );

    const totalItemValue =
      quantity * unitPrice;

    return (
      <View
        style={[
          styles.row,
          index % 2 === 1 && styles.alternateRow,
        ]}>
        
        <Text
          style={[
            styles.cell,
            styles.snoCell,
          ]}>
          {index + 1}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.idCell,
          ]}>
          {item.itemID ?? '-'}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.nameCell,
          ]}
          numberOfLines={1}>
          {item.name ?? '-'}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.numberCell,
          ]}>
          {quantity}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.priceCell,
          ]}>
          ₹{unitPrice.toFixed(2)}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.priceCell,
            styles.totalValueCell,
          ]}>
          ₹{totalItemValue.toFixed(2)}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#2563eb"
        />

        <Text style={styles.loadingText}>
          Loading inventory report...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}>
        
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.topSection}>
            <View>
              <Text style={styles.title}>
                Inventory Report
              </Text>

              <Text style={styles.subtitle}>
                Inventory quantity and valuation summary
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadInventory}
              disabled={loading}>
              <Text style={styles.refreshText}>
                ↻ Refresh
              </Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {items.length}
              </Text>

              <Text style={styles.summaryLabel}>
                Items
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {totalQuantity}
              </Text>

              <Text style={styles.summaryLabel}>
                Total Quantity
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ₹{totalValue.toFixed(2)}
              </Text>

              <Text style={styles.summaryLabel}>
                Inventory Value
              </Text>
            </View>

          </View>

          {/* Table */}
          <View style={styles.tableContainer}>

            {/* Table Header */}
            <View style={styles.header}>

              <Text
                style={[
                  styles.headerCell,
                  styles.snoCell,
                ]}>
                #
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.idCell,
                ]}>
                ID
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.nameCell,
                ]}>
                Item Name
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.numberCell,
                ]}>
                Quantity
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.priceCell,
                ]}>
                Unit Price
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.priceCell,
                ]}>
                Total Value
              </Text>

            </View>

            {/* Table Data */}
            <FlatList
              data={items}
              keyExtractor={(item, index) =>
                String(
                  item.itemID ?? index,
                )
              }
              renderItem={renderItem}
              refreshing={loading}
              onRefresh={loadInventory}
              ListEmptyComponent={
                <View
                  style={
                    styles.emptyContainer
                  }>
                  
                  <Text
                    style={
                      styles.emptyIcon
                    }>
                    📦
                  </Text>

                  <Text
                    style={
                      styles.emptyTitle
                    }>
                    No Inventory Found
                  </Text>

                  <Text
                    style={
                      styles.emptyText
                    }>
                    There are no inventory items
                    available for this report.
                  </Text>

                </View>
              }
            />

          </View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },

  container: {
    width: 800,
    minHeight: '100%',
    padding: 20,
    backgroundColor: '#f5f7fb',
  },

  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#172033',
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
  },

  refreshButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  refreshText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
  },

  summaryItem: {
    flex: 1,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    fontSize: 23,
    fontWeight: '800',
    color: '#2563eb',
  },

  summaryLabel: {
    marginTop: 5,
    fontSize: 13,
    color: '#6b7280',
  },

  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
  },

  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    minHeight: 52,
    alignItems: 'center',
    backgroundColor: '#172033',
    borderBottomWidth: 1,
    borderBottomColor: '#111827',
  },

  row: {
    flexDirection: 'row',
    minHeight: 58,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f4',
  },

  alternateRow: {
    backgroundColor: '#f9fafb',
  },

  headerCell: {
    paddingHorizontal: 10,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  cell: {
    paddingHorizontal: 10,
    color: '#374151',
    fontSize: 14,
  },

  snoCell: {
    width: 50,
    textAlign: 'center',
  },

  idCell: {
    width: 80,
    textAlign: 'center',
  },

  nameCell: {
    width: 220,
  },

  numberCell: {
    width: 120,
    textAlign: 'center',
  },

  priceCell: {
    width: 150,
    textAlign: 'right',
  },

  totalValueCell: {
    fontWeight: '700',
    color: '#111827',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fb',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6b7280',
  },

  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },

  emptyText: {
    marginTop: 6,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },

});

export default InventoryReport;