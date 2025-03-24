// RegisterScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, 'users', userCred.user.uid), {
                email: userCred.user.email,
                createdAt: new Date(),
                role: 'user'
            });
            alert('Регистрация успешна! Теперь войдите.');
            navigation.replace('Login');
        } catch (err) {
            alert('Ошибка регистрации: ' + err.message);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ marginBottom: 10 }} />
            <TextInput label="Пароль" value={password} onChangeText={setPassword} secureTextEntry style={{ marginBottom: 10 }} />
            <Button mode="contained" onPress={handleRegister}>Зарегистрироваться</Button>
        </View>
    );
}
