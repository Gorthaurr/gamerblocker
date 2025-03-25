import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { API_URL } from './config';

// Screens
import AuthOptionsScreen from './AuthOptionsScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import DeviceListScreen from './DeviceListScreen';
import AddDeviceScreen from './AddDeviceScreen';
import DeviceControlScreen from './DeviceControlScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                if (token) {
                    const response = await fetch(`${API_URL}/auth/user`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch {
                setUser(null);
            } finally {
                setCheckingAuth(false);
            }
        };

        checkUser();
    }, []);

    const handleLogout = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            await AsyncStorage.removeItem('token');
            setUser(null);
        }
    };

    if (checkingAuth) {
        return null; // Можно показать индикатор загрузки
    }

    return (
        <PaperProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    {user ? (
                        <>
                            <Stack.Screen name="DeviceList" component={DeviceListScreen} />
                            <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
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
