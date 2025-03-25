import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function generateLinkScreen() {
    const generateLink = async () => {
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(`${API_URL}/generate-link`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });

        const { url } = await response.json();
        alert(url || 'Ошибка получения ссылки');
    };

    return (
        <View style={{ padding: 20 }}>
            <Button onPress={generateLink}>Генерировать ссылку</Button>
        </View>
    );
}
