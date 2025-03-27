import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { API_URL } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GenerateLinkScreen() {
    const [deviceName, setDeviceName] = useState('');
    const [loading, setLoading] = useState(false);

    const generateLink = async () => {
        if (!deviceName.trim()) {
            Alert.alert('Ошибка', 'Введите название устройства');
            return;
        }

        try {
            setLoading(true);
            console.log('Начало генерации ссылки...');
            
            const token = await AsyncStorage.getItem('token');
            console.log('Токен получен:', token ? 'Да' : 'Нет');
            console.log('API_URL:', API_URL);
            
            const requestBody = { deviceName: deviceName.trim() };
            console.log('Тело запроса:', requestBody);
            
            const response = await fetch(`${API_URL}/generateLink`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('Статус ответа:', response.status);
            console.log('Заголовки ответа:', response.headers);

            if (!response.ok) {
                const error = await response.json();
                console.error('Ошибка ответа:', error);
                throw new Error(error.message || 'Ошибка генерации ссылки');
            }

            const data = await response.json();
            console.log('Успешный ответ:', data);
            Alert.alert('Успех', `Ссылка сгенерирована: ${data.url}`);
            setDeviceName('');
        } catch (error) {
            console.error('Ошибка генерации ссылки:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось сгенерировать ссылку');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Название устройства"
                value={deviceName}
                onChangeText={setDeviceName}
                mode="outlined"
                style={styles.input}
                disabled={loading}
            />
            <Button 
                mode="contained" 
                onPress={generateLink}
                loading={loading}
                disabled={loading || !deviceName.trim()}
                style={styles.button}
            >
                Генерировать ссылку
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    input: {
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    button: {
        marginTop: 10
    }
});
