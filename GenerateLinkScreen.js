// GenerateLinkScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth, db } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import * as Clipboard from 'expo-clipboard';

export default function GenerateLinkScreen() {
    const [deviceName, setDeviceName] = useState('');
    const [link, setLink] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const generateLink = async () => {
        const user = auth.currentUser;
        if (!user || !deviceName) return;

        setIsLoading(true);
        const deviceId = uuidv4();
        const deviceRef = doc(db, 'users', user.uid, 'devices', deviceId);

        await setDoc(deviceRef, {
            deviceName,
            isBlocked: false,
            createdAt: new Date(),
        });

        const config = {
            userId: user.uid,
            deviceId,
            deviceName,
        };

        const response = await fetch('https://yourdomain.com/api/upload-config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config),
        });

        const { url } = await response.json();
        setLink(url);
        setIsLoading(false);
    };

    const copyLink = async () => {
        if (link) {
            await Clipboard.setStringAsync(link);
            alert('Ссылка скопирована');
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                label="Имя устройства"
                value={deviceName}
                onChangeText={setDeviceName}
                style={{ marginBottom: 10 }}
            />
            <Button mode="contained" onPress={generateLink} loading={isLoading}>
                Сгенерировать ссылку
            </Button>
            {link && (
                <View style={{ marginTop: 20 }}>
                    <Text>Ссылка на установку агента:</Text>
                    <Text selectable>{link}</Text>
                    <Button onPress={copyLink}>Скопировать ссылку</Button>
                </View>
            )}
        </View>
    );
}
