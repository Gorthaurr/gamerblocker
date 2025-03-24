import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRegistry } from 'react-native'; // Добавьте это, если его нет
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig';

// Screens
import AuthOptionsScreen from './AuthOptionsScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import AddDeviceScreen from './AddDeviceScreen';
import DeviceListScreen from './DeviceListScreen';
import DeviceControlScreen from './DeviceControlScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setCheckingAuth(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        setUser(null);
    };

    if (checkingAuth) return null; // можно показать индикатор загрузки

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <>
                            <Stack.Screen name="DeviceList">
                                {(props) => <DeviceListScreen {...props} />}
                            </Stack.Screen>
                            <Stack.Screen name="AddDevice">
                                {(props) => <AddDeviceScreen {...props} onLogout={handleLogout} />}
                            </Stack.Screen>
                            <Stack.Screen name="DeviceControl" component={DeviceControlScreen} />
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}

AppRegistry.registerComponent('gamerblocker', () => App); // Проверьте имя компонента
