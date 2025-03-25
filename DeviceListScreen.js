import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { API_URL } from './config';  // Добавим импорт API_URL из файла конфигурации
import { v4 as uuidv4 } from 'uuid';
import * as Clipboard from 'expo-clipboard';

export default function AddDeviceScreen({ navigation }) {
    const [deviceName, setDeviceName] = useState('');
    const [link, setLink] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddDevice = async () => {
        const user = auth.currentUser;
        if (!user || !deviceName) {
            Alert.alert('Ошибка', 'Пожалуйста, введите название устройства.');
            return;
        }

        setIsLoading(true);
        const deviceId = uuidv4();

        // Создаем конфигурацию для отправки на сервер
        const config = {
            userId: user.uid,
            deviceId,
            deviceName,
        };

        try {
            // Запрос на сервер для получения ссылки на exe
            const response = await fetch(`${API_URL}/generate-download-link`, {  // Используем базовый URL из конфигурации
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config),
            });

            // Обработка ошибки, если сервер не вернул правильный ответ
            if (!response.ok) {
                throw new Error('Не удалось получить ссылку на установку.');
            }

            // Получаем ссылку от сервера
            const { url } = await response.json();
            setLink(url);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Ошибка', 'Не удалось получить ссылку. Попробуйте еще раз.');
        }

        setIsLoading(false);
    };

    const copyLink = async () => {
        if (link) {
            await Clipboard.setStringAsync(link);
            Alert.alert('Ссылка скопирована', 'Ссылка на установку скопирована в буфер обмена.');
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
            <Button mode="contained" onPress={handleAddDevice} loading={isLoading}>
                Добавить устройство
            </Button>

            {link && (
                <Card style={{ marginTop: 20, padding: 10 }}>
                    <Text style={{ marginBottom: 5 }}>Ссылка на установку агента:</Text>
                    <Text selectable>{link}</Text>
                    <Button onPress={copyLink} style={{ marginTop: 10 }}>
                        Скопировать ссылку
                    </Button>
                </Card>
            )}
        </View>
    );
}
