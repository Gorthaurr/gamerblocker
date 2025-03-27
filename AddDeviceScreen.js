import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { TextInput, Button, Text, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import { API_URL } from './config';

export default function AddDeviceScreen({ navigation }) {
    const [deviceName, setDeviceName] = useState('');
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddDevice = async () => {
        if (!deviceName.trim()) {
            Alert.alert('Ошибка', 'Введите название устройства');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            
            if (!token) {
                throw new Error('Токен авторизации не найден');
            }

            const response = await fetch(`${API_URL}/generate-link`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ deviceName: deviceName.trim() }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка создания ссылки');
            }

            const data = await response.json();
            setLink(data.link);
            Alert.alert('Успех', 'Ссылка успешно создана');
        } catch (error) {
            console.error('Ошибка создания ссылки:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось создать ссылку');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        try {
            await Clipboard.setStringAsync(link);
            Alert.alert('Успех', 'Ссылка скопирована в буфер обмена');
        } catch (error) {
            console.error('Ошибка копирования:', error);
            Alert.alert('Ошибка', 'Не удалось скопировать ссылку');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.header}>
                        <IconButton
                            icon="account-circle"
                            size={24}
                            style={styles.profileButton}
                            onPress={() => navigation.navigate('Profile')}
                        />
                        <IconButton
                            icon="devices"
                            size={40}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.title}>Добавить устройство</Text>
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
                        style={styles.button} 
                        onPress={handleAddDevice} 
                        loading={loading}
                        disabled={loading || !deviceName.trim()}
                    >
                        Создать ссылку
                    </Button>

                    {link ? (
                        <Card style={styles.linkCard}>
                            <Text selectable style={styles.link}>{link}</Text>
                            <Button 
                                mode="outlined" 
                                style={styles.copyButton} 
                                onPress={copyLink}
                                icon="content-copy"
                            >
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    profileButton: {
        position: 'absolute',
        left: 0,
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
