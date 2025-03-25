import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function AuthOptionsScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>Добро пожаловать</Text>
                <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('Login')}>
                    Войти
                </Button>
                <Button mode="outlined" style={styles.button} onPress={() => navigation.navigate('Register')}>
                    Регистрация
                </Button>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16, backgroundColor: '#f8f9fa' },
    card: { padding: 20, borderRadius: 16, elevation: 5 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    button: { marginTop: 10, borderRadius: 10 },
});
