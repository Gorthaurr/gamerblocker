import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { API_URL } from './config';

export default function AddDeviceScreen() {
    const [deviceName, setDeviceName] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddDevice = async () => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        const res = await fetch(`${API_URL}/generate-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ deviceName }),
        });

        const data = await res.json();
        if (res.ok) {
            setLink(data.link);
        } else {
            alert(data.message);
        }
        setLoading(false);
    };

    const copyLink = () => {
        Clipboard.setStringAsync(link);
        alert('Ссылка скопирована');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <IconButton icon="devices" size={40} style={styles.icon} />
                    <Text style={styles.title}>Добавить устройство</Text>
                    <TextInput
                        label="Название устройства"
                        value={deviceName}
                        onChangeText={setDeviceName}
                        mode="outlined"
                        style={styles.input}
                    />
                    <Button mode="contained" style={styles.button} onPress={handleAddDevice} loading={loading}>
                        Создать ссылку
                    </Button>

                    {link ? (
                        <Card style={styles.linkCard}>
                            <Text selectable style={styles.link}>{link}</Text>
                            <Button mode="outlined" style={styles.copyButton} onPress={copyLink}>
                                Скопировать
                            </Button>
                        </Card>
                    ) : null}
                </Card>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    card: {
        padding: 20,
        borderRadius: 16,
        elevation: 5,
    },
    icon: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    button: {
        borderRadius: 10,
        marginTop: 10,
    },
    linkCard: {
        marginTop: 15,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#e3f2fd',
    },
    link: {
        marginBottom: 10,
        color: '#0d47a1',
    },
    copyButton: {
        borderRadius: 10,
    },
});
