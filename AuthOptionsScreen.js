// AuthOptionsScreen.js
import React, { useEffect } from 'react';
import { View, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

export default function AuthOptionsScreen({ navigation }) {
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: "848177984317-vcor9ctb2rfvguiq9k460lma5583u9l1.apps.googleusercontent.com",
        iosClientId: '848177984317-6sql1305aumrbv4raqtf4ea54ad38h7a.apps.googleusercontent.com',
        androidClientId: '848177984317-ifumi3lpd6nt54g2fepqt6al40sf5t6c.apps.googleusercontent.com'
    });

    useEffect(() => {
        const handleGoogleLogin = async () => {
            if (response?.type === 'success') {
                try {
                    const { id_token } = response.params;
                    const credential = GoogleAuthProvider.credential(id_token);
                    const result = await signInWithCredential(auth, credential);

                    // Проверка: если пользователь не записан в Firestore — записываем
                    const userRef = doc(db, 'users', result.user.uid);
                    const docSnap = await getDoc(userRef);
                    if (!docSnap.exists()) {
                        await setDoc(userRef, {
                            email: result.user.email,
                            createdAt: new Date(),
                            role: 'user'
                        });
                    }

                    navigation.replace('AddDevice');
                } catch (err) {
                    Alert.alert('Ошибка Google входа', err.message);
                }
            }
        };

        handleGoogleLogin();
    }, [response]);

    return (
        <View style={{ padding: 20 }}>
            <Button mode="contained" style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Login')}>
                Войти
            </Button>
            <Button mode="outlined" style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Register')}>
                Зарегистрироваться
            </Button>
            <Button mode="text" disabled={!request} onPress={() => promptAsync()}>
                Войти через Google
            </Button>
        </View>
    );
}
