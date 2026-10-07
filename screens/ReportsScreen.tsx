import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import EmployeeAttendanceReport from '../reports/EmployeeAttendanceReport';
import InventoryReport from '../reports/InventoryReport';
import SalesReport from '../reports/SalesReport';
import PurchaseReport from '../reports/PurchaseReport';
const ReportsScreen = ({ navigation }) => {

  const openEmployeeAttendanceReport = () => {
    navigation.navigate('EmployeeAttendanceReport');
  };

  const openInventoryReport = () => {
    navigation.navigate('InventoryReport');
  };

  const openSalesReport = () => {
    navigation.navigate('SalesReport');
  };

  const openPurchaseReport = () => {
    navigation.navigate('PurchaseReport');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Reports</Text>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={openEmployeeAttendanceReport}
      >
        <Text style={styles.reportTitle}>
          Employee Attendance Report
        </Text>

        <Text style={styles.reportDescription}>
          View employee attendance details
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={openInventoryReport}
      >
        <Text style={styles.reportTitle}>
          Inventory Report
        </Text>

        <Text style={styles.reportDescription}>
          View current inventory and stock details
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={openSalesReport}
      >
        <Text style={styles.reportTitle}>
          Sales Report
        </Text>

        <Text style={styles.reportDescription}>
          View sales orders and sales information
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reportButton}
        onPress={openPurchaseReport}
      >
        <Text style={styles.reportTitle}>
          Purchase Report
        </Text>

        <Text style={styles.reportDescription}>
          View purchase orders and purchase information
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
  },

  reportButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  reportTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  reportDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default ReportsScreen;