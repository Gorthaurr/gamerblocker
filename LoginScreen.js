// LoginScreen.js
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            const userRef = doc(db, 'users', userCred.user.uid);
            const docSnap = await getDoc(userRef);
            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    email: userCred.user.email,
                    createdAt: new Date(),
                    role: 'user'
                });
            }
            navigation.replace('AddDevice');
        } catch (error) {
            Alert.alert('Ошибка входа', error.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={{ marginBottom: 10 }}
            />
            <TextInput
                label="Пароль"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 10 }}
            />
            <Button mode="contained" onPress={handleLogin}>
                Войти
            </Button>
        </View>
    );
}