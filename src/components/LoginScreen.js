import { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const { setIsLoggedIn } = useContext(AuthContext);

    const handleLogin = async () => {
        try {
            const res = await fetch('https://687321edc75558e273536526.mockapi.io/api/admin_users');
            const users = await res.json();

            const user = users.find(
                u =>
                    (u.email.toLowerCase() === identifier.toLowerCase() ||
                        u.username.toLowerCase() === identifier.toLowerCase()) &&
                    u.password === password
            );

            if (user) {
                setIsLoggedIn(true);
                navigation.replace('Main');
            } else {
                Alert.alert('Thông báo', 'Email/Tên người dùng hoặc mật khẩu không chính xác!');
            }
        } catch (err) {
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
                <Text style={[styles.backButtonText, globalStyles.text]}>Trở về trang chủ</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                <Text style={[styles.title, globalStyles.heading]}>ĐĂNG NHẬP</Text>
                <Text style={[styles.subtitle, globalStyles.caption]}>
                    Đăng nhập bằng email hoặc tên người dùng
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, globalStyles.input]}
                        placeholder="Email hoặc tên người dùng"
                        placeholderTextColor="#bdbdbd"
                        autoCapitalize="none"
                        value={identifier}
                        onChangeText={setIdentifier}
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

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={[styles.buttonText, globalStyles.buttonText]}>Đăng nhập</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={[styles.link, globalStyles.text]}>
                        Chưa có tài khoản? Đăng ký
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