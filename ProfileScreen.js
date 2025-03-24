// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { auth, db } from './firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const userRef = doc(db, 'users', auth.currentUser.uid);
                const snap = await getDoc(userRef);
                if (snap.exists()) {
                    setUserData(snap.data());
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <View style={{ padding: 20 }}>
            {userData ? (
                <>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>Email: {userData.email}</Text>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>UID: {auth.currentUser.uid}</Text>
                    <Text style={{ fontSize: 16, marginBottom: 10 }}>Role: {userData.role}</Text>
                    <Text style={{ fontSize: 16, marginBottom: 20 }}>
                        Created At: {userData.createdAt?.toDate ? userData.createdAt.toDate().toLocaleString() : 'неизвестно'}
                    </Text>
                </>
            ) : (
                <Text>Загрузка профиля...</Text>
            )}

            <Button mode="outlined" onPress={() => navigation.goBack()}>
                Назад
            </Button>
        </View>
    );
}
