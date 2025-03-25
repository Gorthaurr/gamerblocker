// RegisterScreen.js
import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Card,
    IconButton,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

export default function RegisterScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Ответ от сервера:', data);

            if (response.ok && data.token && data.user) {
                await AsyncStorage.setItem('token', data.token);
                setUser(data.user); // Установим пользователя
                // НЕ navigation.replace, App сам переключится по user
            } else {
                throw new Error(data.error || 'Ошибка регистрации');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            Alert.alert('Ошибка', error.message);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        />
                        <IconButton icon="account-plus" size={40} style={styles.icon} />
                    </View>
                    <Text style={styles.title}>Регистрация</Text>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <TextInput
                        label="Пароль"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                    />
                    <Button
                        mode="contained"
                        style={styles.registerButton}
                        onPress={handleRegister}
                    >
                        Зарегистрироваться
                    </Button>
                </Card>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
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
    backButton: {
        position: 'absolute',
        left: 0,
    },
    icon: {
        alignSelf: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        marginBottom: 15,
    },
    registerButton: {
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#6200ee',
    },
});
