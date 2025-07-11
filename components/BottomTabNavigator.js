import React, { useContext, useState, createContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Product from './Product';
import Profile from './Profile';

// Simple Auth Context for demo
const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
}

function ProfileWrapper({ navigation }) {
    const { isLoggedIn } = useContext(AuthContext);
    React.useEffect(() => {
        if (!isLoggedIn) {
            navigation.replace('Auth');
        }
    }, [isLoggedIn]);
    return isLoggedIn ? <Profile /> : null;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthStackScreen() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#1a1446', borderTopWidth: 0, height: 70, borderRadius: 20, margin: 10 },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#aaa',
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Product') iconName = 'home-outline';
                    if (route.name === 'ProfileTab') iconName = 'person-outline';
                    return <Ionicons name={iconName} size={28} color={color} />;
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;
                    if (route.name === 'Product') label = 'Home';
                    if (route.name === 'ProfileTab') label = 'Profile';
                    return (
                        <View style={{
                            backgroundColor: focused ? '#2d246b' : 'transparent',
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            paddingVertical: 4,
                            marginTop: -8,
                        }}>
                            <Text style={{ color, fontWeight: focused ? 'bold' : 'normal' }}>{label}</Text>
                        </View>
                    );
                }
            })}
        >
            <Tab.Screen name="Product" component={Product} />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileWrapper}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
}

export default function BottomTabNavigator() {
    return (
        <AuthProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Main" component={MainTab} />
                    <Stack.Screen name="Auth" component={AuthStackScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </AuthProvider>
    );
} 