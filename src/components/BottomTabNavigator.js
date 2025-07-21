import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Product from './Product';
import Profile from './Profile';
import EditProfile from './EditProfile';
import Notifications from './Notifications';
import PrivacySecurity from './PrivacySecurity';
import MyOrders from './MyOrders';
import PaymentMethods from './PaymentMethods';
import { globalStyles } from '../styles/globalStyles';
import { AuthContext, AuthProvider } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function AuthStackScreen() {
    return (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
            <AuthStack.Screen name="Login" component={LoginScreen} />
            <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
    );
}

function ProfileStackScreen() {
    return (
        <ProfileStack.Navigator screenOptions={{ headerShown: true }}>
            <ProfileStack.Screen name="ProfileMain" component={Profile} options={{ title: 'Profile' }} />
            <ProfileStack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile' }} />
            <ProfileStack.Screen name="Notifications" component={Notifications} options={{ title: 'Notifications' }} />
            <ProfileStack.Screen name="PrivacySecurity" component={PrivacySecurity} options={{ title: 'Privacy & Security' }} />
            <ProfileStack.Screen name="MyOrders" component={MyOrders} options={{ title: 'My Orders' }} />
            <ProfileStack.Screen name="PaymentMethods" component={PaymentMethods} options={{ title: 'Payment Methods' }} />
        </ProfileStack.Navigator>
    );
}

function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: { backgroundColor: '#1a1446', borderTopWidth: 0, height: 70, borderRadius: 0, margin: 0 },
                tabBarActiveTintColor: '#fff',
                tabBarInactiveTintColor: '#aaa',
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Product') iconName = 'home-outline';
                    if (route.name === 'ProfileTab') iconName = 'person-outline';
                    return <Ionicons name={iconName} size={28} color={color} />;
                },
                // Remove custom tabBarLabel for default alignment
            })}
        >
            <Tab.Screen name="Product" component={Product} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackScreen}
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