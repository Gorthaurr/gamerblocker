import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig'; // Подключение к Firestore и Firebase

// Генерация ссылки для скачивания
const generateDownloadLink = (deviceId) => {
    return `https://yourdomain.com/download-agent/${deviceId}`;
};

export default function AddDeviceScreen({ navigation }) {
    const [deviceName, setDeviceName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddDevice = async () => {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Пользователь не авторизован.');

            // Генерация уникального ID для устройства
            const deviceId = uuidv4();
            const deviceData = {
                deviceName,
                isBlocked: false,
                deviceId,
                createdAt: new Date(),
            };

            // Добавление устройства в Firestore
            await setDoc(doc(db, 'users', user.uid, 'devices', deviceId), deviceData);

            // Генерация ссылки для скачивания и отправка пользователю
            const downloadLink = generateDownloadLink(deviceId);
            alert(`Устройство добавлено! Ссылка для скачивания агента: ${downloadLink}`);

            // Перенаправление на экран списка устройств
            navigation.navigate('DeviceList');
        } catch (error) {
            setErrorMessage(`Ошибка: ${error.message}`);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                label="Название устройства"
                value={deviceName}
                onChangeText={setDeviceName}
                style={{ marginBottom: 10 }}
            />
            <Button mode="contained" onPress={handleAddDevice}>
                Добавить устройство
            </Button>
            {errorMessage && <Text style={{ color: 'red', marginTop: 10 }}>{errorMessage}</Text>}
        </View>
    );
}
