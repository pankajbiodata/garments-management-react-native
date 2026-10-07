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

const EditEmployee = ({route, navigation}) => {
  // Get employee passed from EmployeeScreen
  const {id, employee} = route.params;

  const [updatedEmployee, setUpdatedEmployee] = useState({
    employeeID: employee.employeeID || '',
    name: employee.name || '',
    contact: employee.contact || '',
    attendance:
      employee.attendance == null
        ? ''
        : String(employee.attendance),
    payments:
      employee.payments == null
        ? ''
        : String(employee.payments),
  });

  const [saving, setSaving] = useState(false);

  // Handle input changes
  const handleInputChange = (key, value) => {
    setUpdatedEmployee(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update employee
  const handleUpdateEmployee = async () => {
    try {
      const employeeID = String(
        updatedEmployee.employeeID ?? '',
      ).trim();

      const name = String(
        updatedEmployee.name ?? '',
      ).trim();

      const contact = String(
        updatedEmployee.contact ?? '',
      ).trim();

      if (!employeeID) {
        Alert.alert(
          'Validation Error',
          'Employee ID is required.',
        );
        return;
      }

      if (!name) {
        Alert.alert(
          'Validation Error',
          'Employee Name is required.',
        );
        return;
      }

      if (!contact) {
        Alert.alert(
          'Validation Error',
          'Contact Number is required.',
        );
        return;
      }

      const attendance =
        updatedEmployee.attendance === '' ||
        updatedEmployee.attendance == null
          ? 0
          : Number(updatedEmployee.attendance);

      const payments =
        updatedEmployee.payments === '' ||
        updatedEmployee.payments == null
          ? 0
          : Number(updatedEmployee.payments);

      if (Number.isNaN(attendance)) {
        Alert.alert(
          'Validation Error',
          'Attendance must be a number.',
        );
        return;
      }

      if (attendance < 0 || attendance > 24) {
        Alert.alert(
          'Validation Error',
          'Attendance must be between 0 and 24 hours.',
        );
        return;
      }

      if (Number.isNaN(payments)) {
        Alert.alert(
          'Validation Error',
          'Payments must be a number.',
        );
        return;
      }

      if (payments < 0) {
        Alert.alert(
          'Validation Error',
          'Payments cannot be negative.',
        );
        return;
      }

      const payload = {
        employeeID: Number(employeeID),
        name: name,
        contact: contact,
        attendance: attendance,
        payments: payments,
      };

      console.log(
        'UPDATE URL:',
        `/Employee/${id}`,
      );

      console.log(
        'UPDATE PAYLOAD:',
        JSON.stringify(payload, null, 2),
      );

      setSaving(true);

      await apiPut(
        `/Employee/${encodeURIComponent(String(id))}`,
        payload,
      );

      console.log(
        'Employee updated successfully.',
      );

      Alert.alert(
        'Success',
        'Employee updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error) {
      console.error(
        'UPDATE ERROR:',
        error,
      );

      if (error.message === 'SESSION_EXPIRED') {
        Alert.alert(
          'Session Expired',
          'Please login again.',
        );
        return;
      }

      Alert.alert(
        'Update Error',
        error?.message ||
          'Unable to update employee.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Edit Employee
      </Text>

      {/* Employee ID */}

      <TextInput
        style={[
          styles.input,
          styles.disabledInput,
        ]}
        placeholder="Employee ID"
        value={String(
          updatedEmployee.employeeID ?? '',
        )}
        editable={false}
      />

      {/* Name */}

      <TextInput
        style={styles.input}
        placeholder="Name *"
        value={updatedEmployee.name}
        onChangeText={value =>
          handleInputChange(
            'name',
            value,
          )
        }
      />

      {/* Contact */}

      <TextInput
        style={styles.input}
        placeholder="Contact Number *"
        value={updatedEmployee.contact}
        onChangeText={value =>
          handleInputChange(
            'contact',
            value,
          )
        }
        keyboardType="phone-pad"
      />

      {/* Attendance */}

      <TextInput
        style={styles.input}
        placeholder="Attendance"
        value={String(
          updatedEmployee.attendance ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'attendance',
            value,
          )
        }
        keyboardType="numeric"
      />

      {/* Payments */}

      <TextInput
        style={styles.input}
        placeholder="Payments"
        value={String(
          updatedEmployee.payments ?? '',
        )}
        onChangeText={value =>
          handleInputChange(
            'payments',
            value,
          )
        }
        keyboardType="numeric"
      />

      {/* Update button */}

      <View style={styles.button}>
        <Button
          title={
            saving
              ? 'Updating...'
              : 'Update Employee'
          }
          onPress={handleUpdateEmployee}
          disabled={saving}
        />
      </View>

      {/* Cancel button */}

      <View style={styles.button}>
        <Button
          title="Cancel"
          color="gray"
          onPress={() =>
            navigation.goBack()
          }
          disabled={saving}
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

  disabledInput: {
    backgroundColor: '#eeeeee',
    color: '#666666',
  },

  button: {
    marginTop: 10,
  },
});

export default EditEmployee;