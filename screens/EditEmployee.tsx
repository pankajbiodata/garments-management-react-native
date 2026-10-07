import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

const API_URL =
  'https://3b36-49-205-47-35.ngrok-free.app/api/Employee';

const EditEmployee = ({route, navigation}) => {

  // Get employee passed from EmployeeScreen
  const {id, employee} = route.params;

  const [updatedEmployee, setUpdatedEmployee] = useState({
    employeeID: employee.employeeID || '',
    name: employee.name || '',
    contact: employee.contact || '',
    attendance: employee.attendance || '',
    payments: employee.payments || '',
  });

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
    const employeeID = String(updatedEmployee.employeeID ?? '').trim();
    const name = String(updatedEmployee.name ?? '').trim();
    const contact = String(updatedEmployee.contact ?? '').trim();

    if (!employeeID) {
      Alert.alert('Validation Error', 'Employee ID is required.');
      return;
    }

    if (!name) {
      Alert.alert('Validation Error', 'Employee Name is required.');
      return;
    }

    if (!contact) {
      Alert.alert('Validation Error', 'Contact Number is required.');
      return;
    }

    // Convert numeric fields to numbers
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

    if (isNaN(attendance)) {
      Alert.alert(
        'Validation Error',
        'Attendance must be a number.',
      );
      return;
    }

    if (isNaN(payments)) {
      Alert.alert(
        'Validation Error',
        'Payments must be a number.',
      );
      return;
    }

    const payload = {
      employeeID: employeeID,
      name: name,
      contact: contact,
      attendance: attendance,
      payments: payments,
    };

    console.log('UPDATE PAYLOAD:');
    console.log(JSON.stringify(payload, null, 2));

    const response = await fetch(
      `${API_URL}/${encodeURIComponent(String(id))}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      },
    );

    const responseText = await response.text();

    console.log('HTTP STATUS:', response.status);
    console.log('SERVER RESPONSE:', responseText);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${responseText}`,
      );
    }

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
    console.error('UPDATE ERROR:', error);

    Alert.alert(
      'Update Error',
      error?.message || 'Unable to update employee.',
    );
  }
};


  return (
    <View style={styles.container}>

      <Text style={styles.header}>
        Edit Employee
      </Text>

      {/* Employee ID */}

<TextInput
  style={styles.input}
  placeholder="Employee ID *"
  value={String(updatedEmployee.employeeID ?? '')}
  editable={false}
/>


      {/* Name */}

      <TextInput
        style={styles.input}
        placeholder="Name"
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
  placeholder="Contact Number"
  value={updatedEmployee.contact}
  onChangeText={value =>
    handleInputChange('contact', value)
  }
  keyboardType="phone-pad"
/>

      {/* Attendance */}

      <TextInput
        style={styles.input}
        placeholder="Attendance"
        value={updatedEmployee.attendance}
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
        value={updatedEmployee.payments}
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
          title="Update Employee"
          onPress={handleUpdateEmployee}
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

export default EditEmployee;