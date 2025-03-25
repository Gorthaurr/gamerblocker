import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Switch, TextInput, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export default function DeviceControlScreen({ route, navigation }) {
    const { device } = route.params;
    const [isBlocked, setIsBlocked] = useState(device.status);
    const [blockFrom, setBlockFrom] = useState('09:00');
    const [blockTo, setBlockTo] = useState('17:00');

    const handleBlockDevice = async () => {
        const token = await AsyncStorage.getItem('token');
        const res = await fetch(`${API_URL}/devices/block`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ deviceId: device.id, status: isBlocked, blockFrom, blockTo }),
        });

        if (res.ok) {
            alert('Настройки сохранены');
            navigation.goBack();
        } else {
            alert('Ошибка при сохранении');
        }
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>{device.name}</Text>
                <View style={styles.switchRow}>
                    <Text>Заблокировать:</Text>
                    <Switch value={isBlocked} onValueChange={setIsBlocked} />
                </View>
                {isBlocked && (
                    <>
                        <TextInput label="С" value={blockFrom} onChangeText={setBlockFrom} style={styles.input} />
                        <TextInput label="До" value={blockTo} onChangeText={setBlockTo} style={styles.input} />
                    </>
                )}
                <Button mode="contained" onPress={handleBlockDevice} style={styles.button}>
                    Сохранить
                </Button>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f8f9fa' },
    card: { padding: 20, borderRadius: 16, elevation: 4 },
    title: { fontSize: 20, marginBottom: 15, fontWeight: 'bold', textAlign: 'center' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    input: { marginTop: 10 },
    button: { marginTop: 20, borderRadius: 10, backgroundColor: '#6200ee', padding: 8 },
});
