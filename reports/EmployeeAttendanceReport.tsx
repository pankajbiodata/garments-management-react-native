import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {apiGet} from '../services/api';

const EmployeeAttendanceReport = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // GET employees using authenticated API service
  const loadEmployees = async () => {
    try {
      setLoading(true);

      console.log('Loading employee attendance report...');

      // IMPORTANT:
      // apiGet automatically handles authentication/token
      const data = await apiGet('/Employee');

      console.log('Employee API response:', data);

      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Employee attendance report error:', error);

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Unable to load employee attendance report.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.row}>
        {/* S.No */}
        <Text style={[styles.cell, styles.snoCell]}>
          {index + 1}
        </Text>

        {/* Employee ID */}
        <Text style={[styles.cell, styles.idCell]}>
          {item.employeeID ?? '-'}
        </Text>

        {/* Name */}
        <Text style={[styles.cell, styles.nameCell]}>
          {item.name ?? '-'}
        </Text>

        {/* Contact */}
        <Text style={[styles.cell, styles.contactCell]}>
          {item.contact ?? '-'}
        </Text>

        {/* Attendance */}
        <Text style={[styles.cell, styles.numberCell]}>
          {item.attendance ?? 0}
        </Text>

        {/* Payments */}
        <Text style={[styles.cell, styles.numberCell]}>
          {item.payments ?? 0}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.topSection}>
        <View>
          <Text style={styles.title}>
            Employee Attendance
          </Text>

          <Text style={styles.subtitle}>
            Attendance and payment report
          </Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadEmployees}
          disabled={loading}>
          <Text style={styles.refreshText}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUMMARY */}
      {!loading && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {employees.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Employees
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {employees.reduce(
                (total, employee) =>
                  total + Number(employee.attendance || 0),
                0,
              )}
            </Text>

            <Text style={styles.summaryLabel}>
              Attendance
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {employees.reduce(
                (total, employee) =>
                  total + Number(employee.payments || 0),
                0,
              )}
            </Text>

            <Text style={styles.summaryLabel}>
              Payments
            </Text>
          </View>
        </View>
      )}

      {/* TABLE */}
      <View style={styles.tableContainer}>

        {/* TABLE HEADER */}
        <View style={styles.headerRow}>

          <Text style={[styles.headerCell, styles.snoCell]}>
            #
          </Text>

          <Text style={[styles.headerCell, styles.idCell]}>
            ID
          </Text>

          <Text style={[styles.headerCell, styles.nameCell]}>
            Employee Name
          </Text>

          <Text style={[styles.headerCell, styles.contactCell]}>
            Contact
          </Text>

          <Text style={[styles.headerCell, styles.numberCell]}>
            Attendance
          </Text>

          <Text style={[styles.headerCell, styles.numberCell]}>
            Payments
          </Text>

        </View>

        {/* LOADING */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2563eb"
            />

            <Text style={styles.loadingText}>
              Loading employee report...
            </Text>
          </View>
        ) : (
          <FlatList
            data={employees}
            keyExtractor={(item, index) =>
              String(item.employeeID ?? index)
            }
            renderItem={renderItem}
            refreshing={loading}
            onRefresh={loadEmployees}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>
                  👥
                </Text>

                <Text style={styles.emptyTitle}>
                  No Employees Found
                </Text>

                <Text style={styles.emptyText}>
                  There are no employees available for the report.
                </Text>
              </View>
            }
          />
        )}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
    padding: 20,
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
    fontWeight: '700',
    fontSize: 14,
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
    alignItems: 'center',
  },

  summaryValue: {
    fontSize: 23,
    fontWeight: '800',
    color: '#2563eb',
  },

  summaryLabel: {
    marginTop: 4,
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

  headerRow: {
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
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f4',
    backgroundColor: '#ffffff',
  },

  headerCell: {
    paddingHorizontal: 8,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  cell: {
    paddingHorizontal: 8,
    color: '#374151',
    fontSize: 14,
  },

  snoCell: {
    width: 45,
    textAlign: 'center',
  },

  idCell: {
    width: 70,
    textAlign: 'center',
  },

  nameCell: {
    width: 180,
  },

  contactCell: {
    width: 150,
  },

  numberCell: {
    width: 110,
    textAlign: 'center',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  loadingText: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 15,
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

export default EmployeeAttendanceReport;
