import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        return data.user;
    }

    throw new Error(data.message || 'Ошибка входа');
};

export const register = async (email, password) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        return data.user;
    }

    throw new Error(data.message || 'Ошибка регистрации');
};

export const logout = async () => {
    const token = await AsyncStorage.getItem('token');
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    await AsyncStorage.removeItem('token');
};

export const getCurrentUser = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    return data.user || null;
};
