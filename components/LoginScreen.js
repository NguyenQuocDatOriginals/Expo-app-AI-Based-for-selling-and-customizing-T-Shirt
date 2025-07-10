import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');

    const handleSignUp = () => {
        navigation.replace('Main');
    };

    return (
        <View style={styles.flex}>
            <LinearGradient
                colors={['#1a237e', '#000']}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            <View style={styles.overlay} />
            <View style={styles.container}>
                <Text style={styles.title}>SIGN IN</Text>
                <Text style={styles.subtitle}>Sign in with email address</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Yourname@gmail.com"
                        placeholderTextColor="#bdbdbd"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.link}>Don't have an account? Register</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <Text style={styles.orText}>Or continue with</Text>
                <View style={styles.socialContainer}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialText}>Facebook</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.terms}>
                    By registering you with our <Text style={styles.link}>Terms and Conditions</Text>
                </Text>
                <Text style={styles.copyright}>COPYRIGHT BY IBRAHIM MEMON</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    background: { ...StyleSheet.absoluteFillObject },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(26,20,70,0.4)' },
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    title: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginBottom: 8, marginTop: 40 },
    subtitle: { color: '#fff', fontSize: 14, marginBottom: 24 },
    inputContainer: { width: '80%', backgroundColor: '#2d225a', borderRadius: 10, marginBottom: 16, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
    input: { flex: 1, color: '#fff', height: 48 },
    button: { width: '80%', backgroundColor: '#38b6ff', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    divider: { width: '80%', height: 1, backgroundColor: '#3a2e6c', marginVertical: 16 },
    orText: { color: '#fff', marginBottom: 12 },
    socialContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 16 },
    socialButton: { flex: 1, backgroundColor: '#2d225a', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginHorizontal: 4 },
    socialText: { color: '#fff', fontWeight: 'bold' },
    terms: { color: '#fff', fontSize: 12, marginTop: 8, textAlign: 'center' },
    link: { textDecorationLine: 'underline', color: '#38b6ff', marginTop: 8 },
    copyright: { color: '#bdbdbd', fontSize: 10, position: 'absolute', bottom: 12, alignSelf: 'center' },
}); 