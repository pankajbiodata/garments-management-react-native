import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import {apiGet, apiPut} from '../services/api';


const EditWorkAssignment = ({route, navigation}) => {

  const {workAssignment} = route.params;

  const [employees, setEmployees] = useState([]);

  const [assignment, setAssignment] = useState({
    taskID: workAssignment?.taskID ?? '',
    workerID: workAssignment?.workerID
      ? String(workAssignment.workerID)
      : '',
    status: workAssignment?.status ?? '',
    payment: workAssignment?.payment != null
      ? String(workAssignment.payment)
      : '',
  });

  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(true);


  // ============================================================
  // LOAD EMPLOYEES
  // ============================================================

  useEffect(() => {
    loadEmployees();
  }, []);


  const loadEmployees = async () => {

    try {

      setLoadingEmployees(true);

      const response =
        await apiGet('/Employee/GetEmployeeList');

      setEmployees(response || []);

    } catch (error) {

      console.error(
        'Error loading employees:',
        error,
      );

      if (
        error?.response?.status === 401 ||
        error?.message?.includes('401') ||
        error?.message?.toLowerCase().includes('session')
      ) {

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

      } else {

        Alert.alert(
          'Error',
          'Unable to load employees.',
        );
      }

    } finally {

      setLoadingEmployees(false);

    }
  };


  // ============================================================
  // UPDATE FIELD
  // ============================================================

  const updateField = (field, value) => {

    setAssignment(prev => ({
      ...prev,
      [field]: value,
    }));

  };


  // ============================================================
  // VALIDATION
  // ============================================================

  const validate = () => {

    if (!assignment.workerID) {

      Alert.alert(
        'Validation',
        'Please select an employee.',
      );

      return false;
    }


    if (!assignment.status) {

      Alert.alert(
        'Validation',
        'Please select a status.',
      );

      return false;
    }


    if (
      assignment.payment === '' ||
      isNaN(Number(assignment.payment))
    ) {

      Alert.alert(
        'Validation',
        'Please enter a valid payment.',
      );

      return false;
    }


    if (Number(assignment.payment) < 0) {

      Alert.alert(
        'Validation',
        'Payment cannot be negative.',
      );

      return false;
    }


    return true;
  };


  // ============================================================
  // UPDATE WORK ASSIGNMENT
  // ============================================================

  const handleUpdate = async () => {

    if (!validate()) {
      return;
    }


    try {

      setLoading(true);


      const payload = {
        taskID: Number(assignment.taskID),
        workerID: Number(assignment.workerID),
        status: assignment.status,
        payment: Number(assignment.payment),
      };


      console.log(
        'Updating Work Assignment:',
        payload,
      );


      await apiPut(
        `/WorkAssignment/UpdateWorkAssignment/${assignment.taskID}`,
        payload,
      );


      Alert.alert(
        'Success',
        'Work assignment updated successfully.',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.goBack(),
          },
        ],
      );


    } catch (error) {

      console.error(
        'Update Work Assignment Error:',
        error,
      );


      if (
        error?.response?.status === 401 ||
        error?.message?.includes('401') ||
        error?.message?.toLowerCase().includes('session')
      ) {

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

      } else {

        Alert.alert(
          'Error',
          error?.response?.data?.message ||
            error?.message ||
            'Unable to update work assignment.',
        );

      }

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // SCREEN
  // ============================================================

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled">

      <View style={styles.card}>

        {/* ================================================== */}
        {/* TASK ID */}
        {/* ================================================== */}

        <Text style={styles.label}>
          Task ID
        </Text>

        <View style={styles.readOnlyBox}>

          <Text style={styles.readOnlyText}>
            {assignment.taskID}
          </Text>

        </View>


        {/* ================================================== */}
        {/* WORKER */}
        {/* ================================================== */}

        <Text style={styles.label}>
          Worker
        </Text>

        <View style={styles.pickerContainer}>

          {loadingEmployees ? (

            <ActivityIndicator
              size="small"
              color="#2563EB"
              style={styles.loader}
            />

          ) : (

            <Picker
              selectedValue={assignment.workerID}
              onValueChange={value =>
                updateField('workerID', value)
              }>

              <Picker.Item
                label="Select Employee"
                value=""
              />

              {employees.map(employee => (

                <Picker.Item
                  key={employee.employeeID}
                  label={`${employee.name} (${employee.employeeID})`}
                  value={String(employee.employeeID)}
                />

              ))}

            </Picker>

          )}

        </View>


        {/* ================================================== */}
        {/* STATUS */}
        {/* ================================================== */}

        <Text style={styles.label}>
          Status
        </Text>

        <View style={styles.pickerContainer}>

          <Picker
            selectedValue={assignment.status}
            onValueChange={value =>
              updateField('status', value)
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


        {/* ================================================== */}
        {/* PAYMENT */}
        {/* ================================================== */}

        <Text style={styles.label}>
          Payment
        </Text>

        <TextInput
          style={styles.input}
          value={assignment.payment}
          onChangeText={value =>
            updateField('payment', value)
          }
          placeholder="Enter payment"
          placeholderTextColor="#94A3B8"
          keyboardType="decimal-pad"
        />


        {/* ================================================== */}
        {/* UPDATE BUTTON */}
        {/* ================================================== */}

        <TouchableOpacity
          style={[
            styles.updateButton,
            loading && styles.disabledButton,
          ]}
          onPress={handleUpdate}
          disabled={loading}
          activeOpacity={0.8}>

          {loading ? (

            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />

          ) : (

            <Text style={styles.updateButtonText}>
              Update Work Assignment
            </Text>

          )}

        </TouchableOpacity>


        {/* ================================================== */}
        {/* CANCEL */}
        {/* ================================================== */}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}>

          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
};


// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  contentContainer: {
    padding: 16,
    paddingBottom: 35,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,

    elevation: 4,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
    marginTop: 5,
  },

  readOnlyBox: {
    height: 50,

    borderWidth: 1,
    borderColor: '#E2E8F0',

    borderRadius: 10,

    backgroundColor: '#F8FAFC',

    justifyContent: 'center',

    paddingHorizontal: 14,

    marginBottom: 14,
  },

  readOnlyText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },

  input: {
    height: 50,

    borderWidth: 1,
    borderColor: '#CBD5E1',

    borderRadius: 10,

    paddingHorizontal: 14,

    fontSize: 15,

    color: '#0F172A',

    backgroundColor: '#FFFFFF',

    marginBottom: 14,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E1',

    borderRadius: 10,

    backgroundColor: '#FFFFFF',

    overflow: 'hidden',

    marginBottom: 14,
  },

  loader: {
    height: 50,
  },

  updateButton: {
    height: 52,

    borderRadius: 10,

    backgroundColor: '#2563EB',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 12,
  },

  disabledButton: {
    opacity: 0.7,
  },

  updateButtonText: {
    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',
  },

  cancelButton: {
    height: 50,

    borderRadius: 10,

    borderWidth: 1,

    borderColor: '#CBD5E1',

    alignItems: 'center',
    justifyContent: 'center',

    marginTop: 12,
  },

  cancelButtonText: {
    color: '#475569',

    fontSize: 15,

    fontWeight: '700',
  },

});


export default EditWorkAssignment;