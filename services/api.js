import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  'https://1dde-49-205-47-35.ngrok-free.app/api';

const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (response.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');

      throw new Error('SESSION_EXPIRED');
    }

    if (response.status === 403) {
      throw new Error(
        data?.message ||
          'You do not have permission to perform this operation.'
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
          data?.Message ||
          data ||
          `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const apiGet = endpoint =>
  apiRequest(endpoint, {
    method: 'GET',
  });

export const apiPost = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const apiPut = (endpoint, body) =>
  apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

export const apiDelete = endpoint =>
  apiRequest(endpoint, {
    method: 'DELETE',
  });

export { API_URL };