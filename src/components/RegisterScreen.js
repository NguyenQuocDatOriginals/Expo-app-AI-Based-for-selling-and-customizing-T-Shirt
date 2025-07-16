import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleRegister = async () => {
        try {
            const res = await fetch('https://687321edc75558e273536526.mockapi.io/api/admin_users');
            const users = await res.json();
            const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

            if (exists) {
                Alert.alert('Thông báo', 'Email đã tồn tại!');
                return;
            }

            await fetch('https://687321edc75558e273536526.mockapi.io/api/admin_users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role: 'user',
                    status: 'active',
                }),
            });

            setIsLoggedIn(true);
            navigation.replace('Main');
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể đăng ký. Vui lòng thử lại sau.');
        }
    };

    const handleBackToHome = () => navigation.replace('Main');

    return (
        <View style={styles.flex}>
            <LinearGradient colors={['#1a237e', '#000']} style={styles.background} />
            <View style={styles.overlay} />

            <TouchableOpacity style={styles.backButton} onPress={handleBackToHome}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={[styles.backButtonText, globalStyles.text]}>Trở về trang chủ</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                <Text style={[styles.title, globalStyles.heading]}>ĐĂNG KÝ</Text>
                <Text style={[styles.subtitle, globalStyles.caption]}>Tạo tài khoản của bạn</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Tên người dùng"
                        placeholderTextColor="#bdbdbd"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Email"
                        placeholderTextColor="#bdbdbd"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#bdbdbd"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={[styles.buttonText, globalStyles.buttonText]}>Đăng ký</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={[styles.link, globalStyles.text]}>
                        Đã có tài khoản? Đăng nhập
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