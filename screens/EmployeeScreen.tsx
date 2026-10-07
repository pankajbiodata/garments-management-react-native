import React, {useState, useEffect} from 'react';
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

const EmployeeScreen = ({navigation}) => {
  const [employee, setEmployee] = useState({
    employeeID: '',
    name: '',
    contact: '',
    attendance: '',
    payments: '',
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle input
  const handleInputChange = (key, value) => {
    setEmployee(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // GET employees
  const loadEmployees = async () => {
    try {
      setLoading(true);

      console.log('Loading employees...');

      const data = await apiGet('/Employee');

      console.log('Employees API response:', data);

      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error('Load employees error:', error);

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.message || 'Unable to load employees',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ADD employee
  const handleAddEmployee = async () => {
    try {
      if (!employee.name.trim()) {
        Alert.alert(
          'Validation',
          'Employee name is required.',
        );
        return;
      }

      if (!employee.contact.trim()) {
        Alert.alert(
          'Validation',
          'Employee contact is required.',
        );
        return;
      }

      const employeeData = {
        name: employee.name.trim(),
        contact: employee.contact.trim(),
        attendance:
          employee.attendance === ''
            ? 0
            : Number(employee.attendance),
        payments:
          employee.payments === ''
            ? 0
            : Number(employee.payments),
      };

      console.log(
        'Adding employee:',
        employeeData,
      );

      const data = await apiPost(
        '/Employee',
        employeeData,
      );

      console.log(
        'Added employee:',
        data,
      );

      setEmployees(prev => [
        ...prev,
        data,
      ]);

      setEmployee({
        employeeID: '',
        name: '',
        contact: '',
        attendance: '',
        payments: '',
      });

      Alert.alert(
        'Success',
        'Employee added successfully.',
      );
    } catch (error) {
      console.error(
        'Add employee error:',
        error,
      );

      Alert.alert(
        'Error',
        error.message ||
          'Unable to add employee.',
      );
    }
  };

  // DELETE employee
  const handleDeleteEmployee = id => {
    Alert.alert(
      'Delete Employee',
      'Are you sure you want to delete this employee?',
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
              console.log(
                'Deleting employee:',
                id,
              );

              await apiDelete(
                `/Employee/${id}`,
              );

              setEmployees(prev =>
                prev.filter(
                  emp =>
                    String(
                      emp.employeeID,
                    ) !== String(id),
                ),
              );

              Alert.alert(
                'Success',
                'Employee deleted successfully.',
              );
            } catch (error) {
              console.error(
                'Delete employee error:',
                error,
              );

              Alert.alert(
                'Error',
                error.message ||
                  'Unable to delete employee.',
              );
            }
          },
        },
      ],
    );
  };

  // Employee row
  const renderEmployee = ({item}) => {
    return (
      <View style={styles.employeeRow}>

        <Text style={styles.nameCell}>
          {item.name}
        </Text>

        <Text style={styles.contactCell}>
          {item.contact}
        </Text>

        <View style={styles.buttonCell}>
          <Button
            title="Edit"
            onPress={() =>
              navigation.navigate(
                'EditEmployee',
                {
                  id: item.employeeID,
                  employee: item,
                },
              )
            }
          />
        </View>

        <View style={styles.buttonCell}>
          <Button
            title="Delete"
            color="red"
            onPress={() =>
              handleDeleteEmployee(
                item.employeeID,
              )
            }
          />
        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Employee List
      </Text>

      {/* ADD EMPLOYEE FORM */}

      <View style={styles.inputContainer}>

        <TextInput
          style={styles.input}
          placeholder="Employee Name *"
          value={employee.name}
          onChangeText={value =>
            handleInputChange(
              'name',
              value,
            )
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number *"
          value={employee.contact}
          onChangeText={value =>
            handleInputChange(
              'contact',
              value,
            )
          }
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Attendance"
          value={employee.attendance}
          onChangeText={value =>
            handleInputChange(
              'attendance',
              value,
            )
          }
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Payments"
          value={employee.payments}
          onChangeText={value =>
            handleInputChange(
              'payments',
              value,
            )
          }
          keyboardType="numeric"
        />

        <Button
          title="Add Employee"
          onPress={handleAddEmployee}
        />

      </View>

      {/* EMPLOYEE LIST */}

      <View style={styles.table}>

        <View style={styles.employeeHeader}>

          <Text style={styles.nameHeader}>
            Name
          </Text>

          <Text style={styles.contactHeader}>
            Contact Number
          </Text>

          <Text style={styles.actionHeader}>
            Edit
          </Text>

          <Text style={styles.actionHeader}>
            Delete
          </Text>

        </View>

        {loading ? (
          <Text style={styles.emptyText}>
            Loading employees...
          </Text>
        ) : (
          <FlatList
            data={employees}
            keyExtractor={(item, index) =>
              String(
                item.employeeID ?? index,
              )
            }
            renderItem={renderEmployee}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No employees found
              </Text>
            }
            refreshing={loading}
            onRefresh={loadEmployees}
          />
        )}

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
    marginBottom: 15,
  },

  inputContainer: {
    marginBottom: 15,
  },

  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 5,
  },

  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  employeeHeader: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    minHeight: 50,
    alignItems: 'center',
  },

  employeeRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    minHeight: 60,
    alignItems: 'center',
  },

  nameHeader: {
    flex: 1.5,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  contactHeader: {
    flex: 1.5,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },

  actionHeader: {
    width: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },

  nameCell: {
    flex: 1.5,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  contactCell: {
    flex: 1.5,
    paddingHorizontal: 10,
    fontSize: 16,
  },

  buttonCell: {
    width: 80,
    paddingHorizontal: 4,
  },

  emptyText: {
    textAlign: 'center',
    padding: 30,
    fontSize: 16,
  },
});

export default EmployeeScreen;