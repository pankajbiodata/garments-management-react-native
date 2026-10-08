import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {apiGet} from '../services/api';

const WorkAssignmentReport = () => {
  const [assignments, setAssignments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedWorker, setSelectedWorker] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [assignmentResponse, employeeResponse] = await Promise.all([
        apiGet('/WorkAssignment/GetWorkAssignmentList'),
        apiGet('/Employee'),
      ]);

      const assignmentData =
        assignmentResponse?.data || assignmentResponse || [];

      const employeeData =
        employeeResponse?.data || employeeResponse || [];

      setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
      setEmployees(Array.isArray(employeeData) ? employeeData : []);
    } catch (error) {
      console.error('Error loading Work Assignment Report:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEmployeeName = workerID => {
    const employee = employees.find(
      item => Number(item.employeeID) === Number(workerID),
    );

    return employee ? employee.name : `Worker #${workerID}`;
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(item => {
      const workerMatch =
        !selectedWorker ||
        Number(item.workerID) === Number(selectedWorker);

      const statusMatch =
        !selectedStatus ||
        String(item.status).toLowerCase() ===
          selectedStatus.toLowerCase();

      const searchText = search.trim().toLowerCase();

      const searchMatch =
        !searchText ||
        String(item.taskID).includes(searchText) ||
        getEmployeeName(item.workerID)
          .toLowerCase()
          .includes(searchText) ||
        String(item.status || '')
          .toLowerCase()
          .includes(searchText);

      return workerMatch && statusMatch && searchMatch;
    });
  }, [assignments, employees, selectedWorker, selectedStatus, search]);

  const totalTasks = filteredAssignments.length;

  const assignedCount = filteredAssignments.filter(
    item =>
      String(item.status || '').toLowerCase() === 'assigned',
  ).length;

  const inProgressCount = filteredAssignments.filter(
    item =>
      String(item.status || '').toLowerCase() === 'in progress',
  ).length;

  const completedCount = filteredAssignments.filter(
    item =>
      String(item.status || '').toLowerCase() === 'completed',
  ).length;

  const totalPayment = filteredAssignments.reduce(
    (sum, item) => sum + Number(item.payment || 0),
    0,
  );

  const employeeSummary = useMemo(() => {
    const summary = {};

    filteredAssignments.forEach(item => {
      const workerID = item.workerID;

      if (!summary[workerID]) {
        summary[workerID] = {
          workerID,
          name: getEmployeeName(workerID),
          tasks: 0,
          completed: 0,
          payment: 0,
        };
      }

      summary[workerID].tasks += 1;
      summary[workerID].payment += Number(item.payment || 0);

      if (
        String(item.status || '').toLowerCase() ===
        'completed'
      ) {
        summary[workerID].completed += 1;
      }
    });

    return Object.values(summary);
  }, [filteredAssignments, employees]);

  const renderAssignment = ({item}) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.taskCell]}>
        {item.taskID}
      </Text>

      <Text style={[styles.cell, styles.workerCell]}>
        {getEmployeeName(item.workerID)}
      </Text>

      <Text style={[styles.cell, styles.statusCell]}>
        {item.status}
      </Text>

      <Text style={[styles.cell, styles.paymentCell]}>
        ₹{Number(item.payment || 0).toFixed(2)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading Work Assignment Report...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>

      <Text style={styles.title}>
        Work Assignment Report
      </Text>

      {/* Summary */}

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {totalTasks}
          </Text>
          <Text style={styles.summaryLabel}>
            Total Tasks
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {assignedCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Assigned
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {inProgressCount}
          </Text>
          <Text style={styles.summaryLabel}>
            In Progress
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            {completedCount}
          </Text>
          <Text style={styles.summaryLabel}>
            Completed
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>
            ₹{totalPayment.toFixed(2)}
          </Text>
          <Text style={styles.summaryLabel}>
            Total Payment
          </Text>
        </View>
      </View>

      {/* Search */}

      <TextInput
        style={styles.searchInput}
        placeholder="Search task, worker or status..."
        value={search}
        onChangeText={setSearch}
      />

      {/* Worker Filter */}

      <Text style={styles.filterTitle}>
        Employee
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}>

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedWorker === '' &&
              styles.selectedFilterButton,
          ]}
          onPress={() => setSelectedWorker('')}>

          <Text
            style={[
              styles.filterText,
              selectedWorker === '' &&
                styles.selectedFilterText,
            ]}>
            All
          </Text>
        </TouchableOpacity>

        {employees.map(employee => (
          <TouchableOpacity
            key={employee.employeeID}
            style={[
              styles.filterButton,
              Number(selectedWorker) ===
                Number(employee.employeeID) &&
                styles.selectedFilterButton,
            ]}
            onPress={() =>
              setSelectedWorker(
                String(employee.employeeID),
              )
            }>

            <Text
              style={[
                styles.filterText,
                Number(selectedWorker) ===
                  Number(employee.employeeID) &&
                  styles.selectedFilterText,
              ]}>
              {employee.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Status Filter */}

      <Text style={styles.filterTitle}>
        Status
      </Text>

      <View style={styles.statusContainer}>
        {['', 'Assigned', 'In Progress', 'Completed'].map(
          status => (
            <TouchableOpacity
              key={status || 'all'}
              style={[
                styles.filterButton,
                selectedStatus === status &&
                  styles.selectedFilterButton,
              ]}
              onPress={() =>
                setSelectedStatus(status)
              }>

              <Text
                style={[
                  styles.filterText,
                  selectedStatus === status &&
                    styles.selectedFilterText,
                ]}>
                {status || 'All'}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Employee Summary */}

      <Text style={styles.sectionTitle}>
        Employee-wise Summary
      </Text>

      <ScrollView horizontal>
        <View style={styles.tableContainer}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, styles.workerSummaryCell]}>
              Worker
            </Text>

            <Text style={[styles.headerCell, styles.numberCell]}>
              Tasks
            </Text>

            <Text style={[styles.headerCell, styles.numberCell]}>
              Completed
            </Text>

            <Text style={[styles.headerCell, styles.paymentSummaryCell]}>
              Payment
            </Text>
          </View>

          {employeeSummary.map(item => (
            <View
              style={styles.row}
              key={String(item.workerID)}>

              <Text
                style={[
                  styles.cell,
                  styles.workerSummaryCell,
                ]}>
                {item.name}
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.numberCell,
                ]}>
                {item.tasks}
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.numberCell,
                ]}>
                {item.completed}
              </Text>

              <Text
                style={[
                  styles.cell,
                  styles.paymentSummaryCell,
                ]}>
                ₹{item.payment.toFixed(2)}
              </Text>
            </View>
          ))}

          {employeeSummary.length === 0 && (
            <Text style={styles.noData}>
              No employee summary available.
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Detailed Assignments */}

      <Text style={styles.sectionTitle}>
        Assignment Details
      </Text>

      <ScrollView horizontal>
        <View style={styles.tableContainer}>

          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, styles.taskCell]}>
              Task ID
            </Text>

            <Text style={[styles.headerCell, styles.workerCell]}>
              Worker
            </Text>

            <Text style={[styles.headerCell, styles.statusCell]}>
              Status
            </Text>

            <Text style={[styles.headerCell, styles.paymentCell]}>
              Payment
            </Text>
          </View>

          <FlatList
            data={filteredAssignments}
            keyExtractor={item =>
              String(item.taskID)
            }
            renderItem={renderAssignment}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.noData}>
                No work assignments found.
              </Text>
            }
          />

        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={loadData}>

        <Text style={styles.refreshText}>
          Refresh Report
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },

  contentContainer: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  summaryCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  summaryLabel: {
    marginTop: 5,
    fontSize: 13,
    color: '#666',
  },

  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  filterScroll: {
    marginBottom: 12,
  },

  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },

  selectedFilterButton: {
    backgroundColor: '#222',
    borderColor: '#222',
  },

  filterText: {
    fontSize: 13,
  },

  selectedFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },

  tableContainer: {
    backgroundColor: '#fff',
    minWidth: 600,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 48,
    alignItems: 'center',
  },

  headerRow: {
    backgroundColor: '#eee',
  },

  headerCell: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
    fontSize: 13,
  },

  cell: {
    paddingHorizontal: 10,
    fontSize: 13,
  },

  taskCell: {
    width: 90,
  },

  workerCell: {
    width: 180,
  },

  statusCell: {
    width: 130,
  },

  paymentCell: {
    width: 130,
    textAlign: 'right',
  },

  workerSummaryCell: {
    width: 180,
    paddingHorizontal: 10,
  },

  numberCell: {
    width: 100,
    textAlign: 'center',
  },

  paymentSummaryCell: {
    width: 130,
    textAlign: 'right',
  },

  noData: {
    padding: 20,
    textAlign: 'center',
    color: '#777',
  },

  refreshButton: {
    backgroundColor: '#222',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },

  refreshText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
  },
});

export default WorkAssignmentReport;