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
  'https://3b36-49-205-47-35.ngrok-free.app/api/Employee';

const EmployeeAttendanceReport = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/`);

      if (!response.ok) {
        throw new Error('Failed to load employee data');
      }

      const data = await response.json();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Unable to load employee attendance report.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.idCell]}>
        {item.employeeID}
      </Text>

      <Text style={[styles.cell, styles.nameCell]}>
        {item.name}
      </Text>

      <Text style={styles.cell}>
        {item.contact}
      </Text>

      <Text style={styles.cell}>
        {item.attendance}
      </Text>

      <Text style={styles.cell}>
        {item.payments}
      </Text>
    </View>
  );

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
          Employee Attendance Report
        </Text>

        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.idCell]}>
            ID
          </Text>

          <Text style={[styles.headerCell, styles.nameCell]}>
            Name
          </Text>

          <Text style={styles.headerCell}>
            Contact
          </Text>

          <Text style={styles.headerCell}>
            Attendance
          </Text>

          <Text style={styles.headerCell}>
            Payments
          </Text>
        </View>

        <FlatList
          data={employees}
          keyExtractor={(item) =>
            String(item.employeeID)
          }
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No employees found.
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
    width: 180,
  },

  empty: {
    padding: 20,
    textAlign: 'center',
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});

export default EmployeeAttendanceReport;