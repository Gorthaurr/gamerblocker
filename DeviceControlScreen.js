// DeviceControlScreen.js
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Switch, TextInput } from 'react-native-paper';
import { setBlockDevice } from './devices';

export default function DeviceControlScreen({ deviceId }) {
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockFrom, setBlockFrom] = useState('09:00');
    const [blockTo, setBlockTo] = useState('17:00');

    const handleBlockDevice = async () => {
        await setBlockDevice(deviceId, isBlocked, blockFrom, blockTo);
        alert(`Устройство ${isBlocked ? 'заблокировано' : 'разблокировано'}`);
    };

    return (
        <View style={{ padding: 20 }}>
            <Switch value={isBlocked} onValueChange={setIsBlocked} />
            <TextInput label="Блокировать от" value={blockFrom} onChangeText={setBlockFrom} />
            <TextInput label="Блокировать до" value={blockTo} onChangeText={setBlockTo} />

            <Button mode="contained" onPress={handleBlockDevice}>
                Применить
            </Button>
        </View>
    );
}
