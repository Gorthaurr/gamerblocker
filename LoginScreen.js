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

export default function LoginScreen({ navigation, setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            console.log('📨 Отправка данных на сервер...');
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('📥 Ответ от сервера:', data);

            if (response.ok && data.token && data.user) {
                console.log('✅ Успешный вход, сохранение токена...');
                await AsyncStorage.setItem('token', data.token);
                console.log('📌 Токен сохранён:', await AsyncStorage.getItem('token'));

                setUser(data.user);
                console.log('🎉 Пользователь установлен:', data.user);
            } else {
                const errorMsg = data.error || 'Неверные учетные данные';
                console.warn('⚠️ Ошибка входа:', errorMsg);
                throw new Error(errorMsg);
            }
        } catch (err) {
            console.error('🔥 Ошибка входа:', err);
            Alert.alert('Ошибка входа', err.message || 'Что-то пошло не так');
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Card style={styles.card}>
                    <View style={styles.header}>
                        <IconButton
                            icon="arrow-left"
                            size={24}
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        />
                        <IconButton
                            icon="account-circle"
                            size={40}
                            style={styles.icon}
                        />
                    </View>
                    <Text style={styles.title}>Вход в аккаунт</Text>
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
                        style={styles.loginButton}
                        onPress={handleLogin}
                    >
                        Войти
                    </Button>
                    <Button mode="text" style={styles.forgotPasswordButton}>
                        Забыли пароль?
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
    loginButton: {
        marginTop: 10,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: '#6200ee',
    },
    forgotPasswordButton: {
        marginTop: 10,
        color: '#6200ee',
    },
});
