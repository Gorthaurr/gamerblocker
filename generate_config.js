// generate_config.js (используется в облаке или firebase functions)

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

async function generateAgentConfig(userId, deviceName) {
    const deviceId = uuidv4();
    const deviceRef = db.collection('users').doc(userId).collection('devices').doc(deviceId);

    await deviceRef.set({
        deviceName,
        isBlocked: false,
        createdAt: new Date(),
    });

    const config = {
        userId,
        deviceId,
        deviceName
    };

    const fileName = `${deviceId}.json`;
    const savePath = path.join(__dirname, 'public/configs', fileName);
    fs.writeFileSync(savePath, JSON.stringify(config, null, 2));

    const downloadUrl = `https://yourdomain.com/configs/${fileName}`;
    console.log('Ссылка для установки агента:', downloadUrl);
}

// Пример вызова
const userId = 'aKl3Z5vivFfBkp251HHRAheSX2h1';
const deviceName = 'ПК Макса';
generateAgentConfig(userId, deviceName);
