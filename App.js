import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';
import AuthOptionsScreen from './AuthOptionsScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import AddDeviceScreen from './AddDeviceScreen';
import DeviceControlScreen from './DeviceControlScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                setUser(null);
                setCheckingAuth(false);
                return;
            }

            try {
                const res = await fetch(`${API_URL}/user`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                } else {
                    await AsyncStorage.removeItem('token');
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                await AsyncStorage.removeItem('token');
                setUser(null);
            }

            setCheckingAuth(false);
        };

        checkUser();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setUser(null);
    };

    if (checkingAuth) return null;

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <>
                            <Stack.Screen name="DeviceControl">
                                {(props) => <DeviceControlScreen {...props} user={user} />}
                            </Stack.Screen>
                            <Stack.Screen name="AddDevice">
                                {(props) => <AddDeviceScreen {...props} user={user} onLogout={handleLogout} />}
                            </Stack.Screen>
                            <Stack.Screen name="Profile">
                                {(props) => <ProfileScreen {...props} user={user} onLogout={handleLogout} />}
                            </Stack.Screen>
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="AuthOptions" component={AuthOptionsScreen} />
                            <Stack.Screen name="Login">
                                {(props) => <LoginScreen {...props} setUser={setUser} />}
                            </Stack.Screen>
                            <Stack.Screen name="Register">
                                {(props) => <RegisterScreen {...props} setUser={setUser} />}
                            </Stack.Screen>
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}
