import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';

const firebaseConfig = { /* твой конфиг Firebase */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Авторизация через Google
export const signInWithGoogle = async () => {
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: '<ТВОЙ_GOOGLE_CLIENT_ID>',
    });

    if (response?.type === 'success') {
        const credential = GoogleAuthProvider.credential(response.authentication.idToken);
        await signInWithCredential(auth, credential);
    } else {
        await promptAsync();
    }
};

// Регистрация через Email
export const registerWithEmail = async (email, password) => {
    return await createUserWithEmailAndPassword(auth, email, password);
};

// Вход через Email
export const loginWithEmail = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
};

export { auth };
