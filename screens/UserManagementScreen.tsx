import React, {useEffect, useState} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Picker} from '@react-native-picker/picker';

import {apiGet, apiPost} from '../services/api';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Staff');

  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const data = await apiGet('/Auth/users');

      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Unable to load users.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    if (!username.trim()) {
      Alert.alert(
        'Validation',
        'Username is required.'
      );
      return;
    }

    if (!password) {
      Alert.alert(
        'Validation',
        'Password is required.'
      );
      return;
    }

    try {
      setSaving(true);

      await apiPost('/Auth/create-user', {
        username: username.trim(),
        password,
        role,
      });

      Alert.alert(
        'Success',
        'User created successfully.'
      );

      setUsername('');
      setPassword('');
      setRole('Staff');
      setModalVisible(false);

      loadUsers();
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Unable to create user.'
      );
    } finally {
      setSaving(false);
    }
  };

  const renderUser = ({item}) => (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.username?.charAt(0)?.toUpperCase()}
        </Text>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>
          {item.username}
        </Text>

        <Text style={styles.role}>
          {item.role}
        </Text>
      </View>

      <View
        style={[
          styles.status,
          {
            backgroundColor: item.isActive
              ? '#DCFCE7'
              : '#FEE2E2',
          },
        ]}>
        <Text
          style={{
            color: item.isActive
              ? '#166534'
              : '#991B1B',
            fontSize: 11,
            fontWeight: 'bold',
          }}>
          {item.isActive ? 'ACTIVE' : 'INACTIVE'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            User Management
          </Text>

          <Text style={styles.subtitle}>
            Manage application users and roles
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>

          <Text style={styles.addButtonText}>
            + USER
          </Text>

        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={item =>
          String(item.userID)
        }
        renderItem={renderUser}
        contentContainerStyle={{
          padding: 16,
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No users found.
          </Text>
        }
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setModalVisible(false)
        }>

        <View style={styles.modalBackground}>

          <View style={styles.modal}>

            <Text style={styles.modalTitle}>
              Create User
            </Text>

            <Text style={styles.label}>
              Username
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Text style={styles.label}>
              Password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>
              Role
            </Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={role}
                onValueChange={setRole}>

                <Picker.Item
                  label="Admin"
                  value="Admin"
                />

                <Picker.Item
                  label="Manager"
                  value="Manager"
                />

                <Picker.Item
                  label="Staff"
                  value="Staff"
                />

                <Picker.Item
                  label="Viewer"
                  value="Viewer"
                />

              </Picker>
            </View>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={createUser}
              disabled={saving}>

              {saving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveText}>
                  CREATE USER
                </Text>
              )}

            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() =>
                setModalVisible(false)
              }>

              <Text style={styles.cancelText}>
                CANCEL
              </Text>

            </TouchableOpacity>

          </View>

        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F6FA',
  },

  header: {
    backgroundColor: '#173F5F',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#D8E5EF',
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },

  addButtonText: {
    color: '#173F5F',
    fontWeight: 'bold',
    fontSize: 12,
  },

  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#173F5F',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  userInfo: {
    flex: 1,
    marginLeft: 13,
  },

  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#172033',
  },

  role: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  status: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },

  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#64748B',
  },

  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },

  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#173F5F',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 9,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D5DCE5',
    borderRadius: 9,
    marginBottom: 18,
  },

  saveButton: {
    height: 50,
    backgroundColor: '#173F5F',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  cancelButton: {
    alignItems: 'center',
    padding: 15,
  },

  cancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
});

export default UserManagementScreen;