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

const PurchaseReport = () => {
  const [purchases, setPurchases] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);

      console.log('Loading purchase report...');

      const [purchaseData, vendorData] =
        await Promise.all([
          apiGet('/Purchase/GetPurchaseReport'),
          apiGet('/Vendor/GetVendorList'),
        ]);

      console.log(
        'Purchase API response:',
        purchaseData,
      );

      console.log(
        'Vendor API response:',
        vendorData,
      );

      setPurchases(
        Array.isArray(purchaseData)
          ? purchaseData
          : [],
      );

      setVendors(
        Array.isArray(vendorData)
          ? vendorData
          : [],
      );
    } catch (error) {
      console.error(
        'Purchase report error:',
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
            'Unable to load purchase report.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const getVendorName = vendorId => {
    const vendor = vendors.find(
      v =>
        Number(v.vendorID) ===
        Number(vendorId),
    );

    return vendor
      ? vendor.name
      : `Vendor ${vendorId ?? '-'}`;
  };

  const totalPurchaseAmount =
    purchases.reduce(
      (total, purchase) =>
        total +
        Number(purchase.amount || 0),
      0,
    );

  const averagePurchaseAmount =
    purchases.length > 0
      ? totalPurchaseAmount /
        purchases.length
      : 0;

  const renderItem = ({item, index}) => {
    const amount = Number(
      item.amount || 0,
    );

    const date = item.date
      ? String(item.date).substring(0, 10)
      : '-';

    return (
      <View
        style={[
          styles.row,
          index % 2 === 1 &&
            styles.alternateRow,
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
          {item.purchaseID ?? '-'}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.vendorCell,
          ]}
          numberOfLines={1}>
          {getVendorName(item.vendorID)}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.dateCell,
          ]}>
          {date}
        </Text>

        <Text
          style={[
            styles.cell,
            styles.amountCell,
          ]}>
          ₹{amount.toFixed(2)}
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
          Loading purchase report...
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

          {/* Page Header */}
          <View style={styles.topSection}>

            <View>
              <Text style={styles.title}>
                Purchase Report
              </Text>

              <Text style={styles.subtitle}>
                Purchase orders and vendor payment summary
              </Text>
            </View>

            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadReport}
              disabled={loading}>

              <Text style={styles.refreshText}>
                ↻ Refresh
              </Text>

            </TouchableOpacity>

          </View>

          {/* Summary Cards */}
          <View style={styles.summaryCard}>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {purchases.length}
              </Text>

              <Text style={styles.summaryLabel}>
                Purchases
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {vendors.length}
              </Text>

              <Text style={styles.summaryLabel}>
                Vendors
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ₹{totalPurchaseAmount.toFixed(2)}
              </Text>

              <Text style={styles.summaryLabel}>
                Total Purchase
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                ₹{averagePurchaseAmount.toFixed(2)}
              </Text>

              <Text style={styles.summaryLabel}>
                Average Purchase
              </Text>
            </View>

          </View>

          {/* Table */}
          <View style={styles.tableContainer}>

            {/* Header */}
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
                Purchase ID
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.vendorCell,
                ]}>
                Vendor
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.dateCell,
                ]}>
                Date
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.amountCell,
                ]}>
                Amount
              </Text>

            </View>

            {/* Data */}
            <FlatList
              data={purchases}
              keyExtractor={(item, index) =>
                String(
                  item.purchaseID ?? index,
                )
              }
              renderItem={renderItem}
              refreshing={loading}
              onRefresh={loadReport}
              ListEmptyComponent={
                <View
                  style={
                    styles.emptyContainer
                  }>

                  <Text
                    style={
                      styles.emptyIcon
                    }>
                    🛒
                  </Text>

                  <Text
                    style={
                      styles.emptyTitle
                    }>
                    No Purchases Found
                  </Text>

                  <Text
                    style={
                      styles.emptyText
                    }>
                    There are no purchase orders
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
    width: 850,
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
    minWidth: 185,
    alignItems: 'center',
    justifyContent: 'center',
  },

  summaryValue: {
    fontSize: 21,
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
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
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
    width: 130,
    textAlign: 'center',
  },

  vendorCell: {
    width: 250,
  },

  dateCell: {
    width: 150,
    textAlign: 'center',
  },

  amountCell: {
    width: 180,
    textAlign: 'right',
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

export default PurchaseReport;