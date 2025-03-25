import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function ProfileScreen({ onLogout }) {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.title}>Профиль</Text>
                <Button mode="contained" onPress={onLogout} style={styles.button}>
                    Выйти
                </Button>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' },
    card: { padding: 20, borderRadius: 16 },
    title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
    button: { borderRadius: 10 },
});
