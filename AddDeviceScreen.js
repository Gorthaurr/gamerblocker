import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { API_URL } from './config';

export default function AddDeviceScreen({ navigation, user }) {
    const [deviceName, setDeviceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState(null);
    const [deviceId, setDeviceId] = useState(null);

    const handleGenerateLink = async () => {
        if (!deviceName.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, введите имя устройства');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_URL}/generate-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ deviceName: deviceName.trim() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Ошибка генерации ссылки');
            }

            const data = await response.json();
            setGeneratedLink(data.link);
            setDeviceId(data.device_id);
        } catch (error) {
            console.error('Ошибка генерации ссылки:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось сгенерировать ссылку');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>Добавить новое устройство</Text>
                    <TextInput
                        label="Имя устройства"
                        value={deviceName}
                        onChangeText={setDeviceName}
                        style={styles.input}
                        disabled={loading}
                    />
                    <Button
                        mode="contained"
                        onPress={handleGenerateLink}
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : 'Сгенерировать ссылку'}
                    </Button>
                </Card.Content>
            </Card>

            {generatedLink && (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>Сгенерированная ссылка</Text>
                        <Text style={styles.link}>{generatedLink}</Text>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('DeviceControl', { deviceId })}
                            style={styles.button}
                        >
                            Перейти к управлению устройством
                        </Button>
                    </Card.Content>
                </Card>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    card: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    link: {
        fontSize: 16,
        color: '#6200ee',
        marginBottom: 16,
        textAlign: 'center',
    },
});
