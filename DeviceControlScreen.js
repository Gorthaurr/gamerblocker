import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Button, Text, Card, Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export default function DeviceControlScreen({ navigation }) {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDevices();
    }, []);

    const loadDevices = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_URL}/devices`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Не удалось загрузить список устройств');
            }

            const data = await response.json();
            setDevices(data);
        } catch (error) {
            console.error('Ошибка загрузки устройств:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить список устройств');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = async (deviceId, currentStatus) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${API_URL}/devices/block`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    deviceId,
                    isBlocked: !currentStatus
                })
            });

            if (!response.ok) {
                throw new Error('Не удалось изменить статус устройства');
            }

            // Обновляем статус устройства в локальном состоянии
            setDevices(devices.map(device => 
                device.id === deviceId 
                    ? { ...device, status: !currentStatus }
                    : device
            ));

            Alert.alert('Успех', `Устройство ${!currentStatus ? 'заблокировано' : 'разблокировано'}`);
        } catch (error) {
            console.error('Ошибка изменения статуса:', error);
            Alert.alert('Ошибка', 'Не удалось изменить статус устройства');
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Загрузка...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('AddDevice')}
                style={styles.addButton}
            >
                Добавить устройство
            </Button>

            {devices.length === 0 ? (
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.emptyText}>У вас пока нет устройств</Text>
                    </Card.Content>
                </Card>
            ) : (
                devices.map(device => (
                    <Card key={device.id} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.title}>{device.name}</Text>
                            <View style={styles.statusContainer}>
                                <Text>Статус: {device.status ? 'Заблокировано' : 'Разблокировано'}</Text>
                                <Switch
                                    value={device.status}
                                    onValueChange={() => handleBlockToggle(device.id, device.status)}
                                    color="#6200ee"
                                />
                            </View>
                        </Card.Content>
                    </Card>
                ))
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
    addButton: {
        marginBottom: 16,
    },
    card: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
    },
});
