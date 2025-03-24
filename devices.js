// devices.js
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

export const addDevice = async (deviceName) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Пользователь не авторизован');

    console.log("Добавление устройства для:", user.uid);

    return await addDoc(collection(db, 'users', user.uid, 'devices'), {
        deviceName,
        isBlocked: false,
        blockFrom: null,
        blockTo: null,
    });
};

export const setBlockDevice = async (deviceId, isBlocked, blockFrom, blockTo) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Пользователь не авторизован');

    const deviceRef = doc(db, 'users', user.uid, 'devices', deviceId);

    return await updateDoc(deviceRef, {
        isBlocked,
        blockFrom,
        blockTo,
    });
};
