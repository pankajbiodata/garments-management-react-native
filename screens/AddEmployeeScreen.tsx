// src/AddEmployeeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddEmployeeScreen = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [contact, setContact] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://1dde-49-205-47-35.ngrok-free.app/api/employee');
        const data = response.data;
        setEmployees(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddEmployee = async () => {
    try {
      const response = await axios.post('https://1dde-49-205-47-35.ngrok-free.app/api/employee', {
        Name: employeeName,
        Contact: contact,
      });

      const data = response.data;
      setEmployees([...employees, data]);
      setEmployeeName('');
      setContact('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Employee</Text>
      <TextInput
        style={styles.input}
        value={employeeName}
        onChangeText={(text) => setEmployeeName(text)}
        placeholder="Employee Name"
      />
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={(text) => setContact(text)}
        placeholder="Contact"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddEmployee}
        >
          <Text>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.list}>
        <FlatList
          data={employees}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => console.log(item)}
            >
              <Text>
                {item.Name} - {item.Contact}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.Name.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
  },
  list: {
    flex: 1,
    padding: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
});

export default AddEmployeeScreen;