import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const EmployeeList = ({ route, navigation }) => {
  const [employees, setEmployees] = useState([]);

  const handleUpdateEmployee = async (id) => {
    try {
      const response = await fetch(`https://1dde-49-205-47-35.ngrok-free.app/api/Employee/${id}`, {
        method: 'GET',
      });

      const data = await response.json();
      setEmployees([data]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Employee List</Text>
      <FlatList
        data={employees}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.employeeID}</Text>
            <Text style={styles.listItemText}>{item.name}</Text>
            <Text style={styles.listItemText}>{item.contact}</Text>
            <Text style={styles.listItemText}>{item.attendance}</Text>
            <Text style={styles.listItemText}>{item.payments}</Text>
          </View>
        )}
        keyExtractor={(item) => item.employeeID.toString()}
      />
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
    marginBottom: 10,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default EmployeeList;