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
import {Picker} from '@react-native-picker/picker';
import {apiGet, apiPost} from '../services/api';

const WorkAssignmentScreen = ({navigation}) => {
  const [workAssignment, setWorkAssignment] = useState({
    workerID: '',
    status: '',
    payment: '',
  });

  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadAssignments();
    loadEmployees();
  }, []);

  // -----------------------------------------
  // Load Work Assignments
  // -----------------------------------------
  const loadAssignments = async () => {
    try {
      const data = await apiGet(
        '/WorkAssignment/GetWorkAssignmentList',
      );

      console.log(
        'GET WORK ASSIGNMENTS RESPONSE:',
        data,
      );

      setAssignments(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'GET WORK ASSIGNMENTS ERROR:',
        error,
      );

      handleError(
        error,
        'Unable to load work assignments.',
      );
    }
  };

  // -----------------------------------------
  // Load Employees
  // -----------------------------------------
  const loadEmployees = async () => {
    try {
      const data = await apiGet(
        '/Employee/GetEmployeeList',
      );

      console.log(
        'GET EMPLOYEES RESPONSE:',
        data,
      );

      setEmployees(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        'GET EMPLOYEES ERROR:',
        error,
      );

      handleError(
        error,
        'Unable to load employees.',
      );
    }
  };

  // -----------------------------------------
  // Error Handler
  // -----------------------------------------
  const handleError = (error, defaultMessage) => {
    console.error(error);

    if (error?.message === 'SESSION_EXPIRED') {
      Alert.alert(
        'Session Expired',
        'Please login again.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              }),
          },
        ],
      );

      return;
    }

    Alert.alert(
      'Error',
      error?.message || defaultMessage,
    );
  };

  // -----------------------------------------
  // Get Employee Name
  // -----------------------------------------
  const getEmployeeName = workerID => {
    const employee = employees.find(
      employee =>
        Number(employee.employeeID) ===
        Number(workerID),
    );

    return employee
      ? employee.name
      : String(workerID ?? '');
  };

  // -----------------------------------------
  // Add Work Assignment
  // -----------------------------------------
  const handleAddAssignment = async () => {
    try {
      const workerID = Number(
        workAssignment.workerID,
      );

      const payment = Number(
        workAssignment.payment,
      );

      // Worker validation
      if (
        !workAssignment.workerID ||
        Number.isNaN(workerID) ||
        workerID <= 0
      ) {
        Alert.alert(
          'Validation Error',
          'Please select an employee.',
        );

        return;
      }

      // Status validation
      const status = String(
        workAssignment.status ?? '',
      ).trim();

      if (!status) {
        Alert.alert(
          'Validation Error',
          'Please select a status.',
        );

        return;
      }

      // Payment validation
      if (
        workAssignment.payment === '' ||
        Number.isNaN(payment) ||
        payment < 0
      ) {
        Alert.alert(
          'Validation Error',
          'Payment must be a valid non-negative number.',
        );

        return;
      }

      const payload = {
        workerID: workerID,
        status: status,
        payment: payment,
      };

      console.log(
        'ADD WORK ASSIGNMENT PAYLOAD:',
        payload,
      );

      await apiPost(
        '/WorkAssignment/AddWorkAssignment',
        payload,
      );

      Alert.alert(
        'Success',
        'Work assignment added successfully.',
      );

      setWorkAssignment({
        workerID: '',
        status: '',
        payment: '',
      });

      loadAssignments();
    } catch (error) {
      console.error(
        'ADD WORK ASSIGNMENT ERROR:',
        error,
      );

      handleError(
        error,
        'Unable to add work assignment.',
      );
    }
  };

  // -----------------------------------------
  // Render Assignment
  // -----------------------------------------
  const renderItem = ({item}) => (
    <View style={styles.row}>

      <Text style={styles.taskCell}>
        {item.taskID}
      </Text>

      <Text style={styles.workerCell}>
        {getEmployeeName(item.workerID)}
      </Text>

      <Text style={styles.statusCell}>
        {item.status}
      </Text>

      <Text style={styles.paymentCell}>
        ₹{Number(item.payment || 0).toFixed(2)}
      </Text>

      <View style={styles.actionCell}>
        <Button
          title="Edit"
          onPress={() =>
            navigation.navigate(
              'EditWorkAssignment',
              {
                id: item.taskID,
                workAssignment: item,
              },
            )
          }
        />
      </View>

    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Work Assignment Management
      </Text>

      {/* Worker / Employee */}

      <Text style={styles.label}>
        Worker
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={
            workAssignment.workerID
          }
          onValueChange={value =>
            setWorkAssignment(prev => ({
              ...prev,
              workerID: value,
            }))
          }>

          <Picker.Item
            label="Select Worker"
            value=""
          />

          {employees.map(employee => (
            <Picker.Item
              key={String(employee.employeeID)}
              label={`${employee.name} (${employee.employeeID})`}
              value={String(employee.employeeID)}
            />
          ))}

        </Picker>
      </View>

      {/* Status */}

      <Text style={styles.label}>
        Status
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={
            workAssignment.status
          }
          onValueChange={value =>
            setWorkAssignment(prev => ({
              ...prev,
              status: value,
            }))
          }>

          <Picker.Item
            label="Select Status"
            value=""
          />

          <Picker.Item
            label="Assigned"
            value="Assigned"
          />

          <Picker.Item
            label="In Progress"
            value="In Progress"
          />

          <Picker.Item
            label="Completed"
            value="Completed"
          />

        </Picker>
      </View>

      {/* Payment */}

      <Text style={styles.label}>
        Payment
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Payment"
        value={workAssignment.payment}
        onChangeText={value =>
          setWorkAssignment(prev => ({
            ...prev,
            payment: value,
          }))
        }
        keyboardType="decimal-pad"
      />

      {/* Add */}

      <View style={styles.addButton}>
        <Button
          title="Add Work Assignment"
          onPress={handleAddAssignment}
        />
      </View>

      {/* Table Header */}

      <View style={styles.headerRow}>

        <Text style={styles.headerCell}>
          Task ID
        </Text>

        <Text style={styles.headerCell}>
          Worker
        </Text>

        <Text style={styles.headerCell}>
          Status
        </Text>

        <Text style={styles.headerCell}>
          Payment
        </Text>

        <Text style={styles.headerCell}>
          Edit
        </Text>

      </View>

      {/* List */}

      <FlatList
        data={assignments}
        keyExtractor={item =>
          String(item.taskID)
        }
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No work assignments found.
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

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
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

  taskCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
  },

  workerCell: {
    flex: 1.5,
    textAlign: 'center',
    padding: 5,
  },

  statusCell: {
    flex: 1.5,
    textAlign: 'center',
    padding: 5,
  },

  paymentCell: {
    flex: 1,
    textAlign: 'center',
    padding: 5,
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

export default WorkAssignmentScreen;
