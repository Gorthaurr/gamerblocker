import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export default function DeviceListScreen({ navigation }) {
    const [devices, setDevices] = useState([]);

    useEffect(() => {
        const fetchDevices = async () => {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${API_URL}/devices`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setDevices(data.devices);
            }
        };
        fetchDevices();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={devices}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DeviceControl', { deviceId: item.id })}>
                        <Card style={styles.card}>
                            <Text style={styles.deviceName}>{item.name}</Text>
                        </Card>
                    </TouchableOpacity>
                )}
            />
            <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('AddDevice')}>
                Добавить устройство
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
    card: { padding: 15, marginBottom: 10, borderRadius: 10 },
    deviceName: { fontSize: 18 },
    button: { marginTop: 10, borderRadius: 10 },
});
