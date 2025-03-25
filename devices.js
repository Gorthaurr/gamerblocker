// devices.js
import { API_URL } from './config';

export const setBlockDevice = async (deviceId, isBlocked, blockFrom, blockTo, token) => {
    const response = await fetch(`${API_URL}/devices/block`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deviceId, isBlocked, blockFrom, blockTo }),
    });

    if (!response.ok) {
        throw new Error('Ошибка при блокировке устройства');
    }

    return response.json();
};
