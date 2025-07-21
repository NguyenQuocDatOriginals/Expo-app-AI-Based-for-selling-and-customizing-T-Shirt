import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';
import { API_BASE_URL } from '@env';

export default function LoginScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        const trimmedIdentifier = identifier.trim().toLowerCase();
        const trimmedPassword = password.trim();

        if (!trimmedIdentifier || !trimmedPassword) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        try {
            console.log('Sending login request:', { identifier: trimmedIdentifier, password: trimmedPassword });

            const res = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    identifier: trimmedIdentifier,
                    password: trimmedPassword,
                }),
            });

            const responseData = await res.json();
            console.log('Login response:', responseData);

            if (res.ok && responseData.success) {
                setIsLoggedIn(true);
                navigation.replace('Main');
            } else {
                Alert.alert('Thông báo', responseData.message || 'Đăng nhập thất bại. Kiểm tra thông tin.');
            }
        } catch (err) {
            console.error('Login error:', err);
            Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ.');
        }
    };

    const handleBackToHome = () => navigation.replace('Main');

    return (
        <View style={styles.flex}>
            <LinearGradient colors={['#1a237e', '#000']} style={styles.background} />
            <View style={styles.overlay} />

            <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={[styles.backButtonText, globalStyles.text]}>Back to Home</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                <Text style={[styles.title, globalStyles.heading]}>LOGIN</Text>
                <Text style={[styles.subtitle, globalStyles.caption]}>
                    Login with your email or username
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Email or Username"
                        placeholderTextColor="#bdbdbd"
                        autoCapitalize="none"
                        value={identifier}
                        onChangeText={setIdentifier}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Password"
                        placeholderTextColor="#bdbdbd"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={[styles.buttonText, globalStyles.buttonText]}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={[styles.link, globalStyles.text]}>
                        Don't have an account? Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,20,70,0.4)' },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        zIndex: 10,
    },
    backButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: '#fff', fontSize: 36, marginBottom: 8, marginTop: 40 },
    subtitle: { color: '#fff', fontSize: 14, marginBottom: 24 },
    inputContainer: {
        width: '80%',
        backgroundColor: '#2d225a',
        borderRadius: 10,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    input: { flex: 1, color: '#fff', height: 48 },
    button: {
        width: '80%',
        backgroundColor: '#38b6ff',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: { color: '#fff', fontSize: 18 },
    link: {
        textDecorationLine: 'underline',
        color: '#38b6ff',
        marginTop: 8,
    },
});