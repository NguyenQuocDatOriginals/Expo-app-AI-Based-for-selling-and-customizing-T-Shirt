import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacySecurity({ navigation }) {
    // Email update states
    const [currentEmail, setCurrentEmail] = useState('john.doe@example.com');
    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');

    // Password update states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showEmailPassword, setShowEmailPassword] = useState(false);

    const validatePassword = (password) => {
        // At least 8 characters, one uppercase, one lowercase, one number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const handleUpdateEmail = () => {
        // Validation
        if (!newEmail || !confirmEmail || !emailPassword) {
            Alert.alert('Error', 'Please fill in all email fields');
            return;
        }

        if (newEmail !== confirmEmail) {
            Alert.alert('Error', 'New email addresses do not match');
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Here you would typically verify the password and update the email
        Alert.alert('Success', 'Email updated successfully!');
        setNewEmail('');
        setConfirmEmail('');
        setEmailPassword('');
    };

    const handleUpdatePassword = () => {
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (!validatePassword(newPassword)) {
            Alert.alert('Error', 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
            return;
        }

        if (currentPassword === newPassword) {
            Alert.alert('Error', 'New password must be different from current password');
            return;
        }

        // Here you would typically verify the current password and update
        Alert.alert('Success', 'Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.header}>
                    <Ionicons name="shield-checkmark-outline" size={60} color="#1a1446" />
                    <Text style={styles.title}>Privacy & Security</Text>
                    <Text style={styles.subtitle}>Manage your account security settings</Text>
                </View>

                {/* Email Update Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="mail-outline" size={20} color="#1a1446" /> Update Email Address
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Email</Text>
                        <TextInput
                            style={[styles.input, styles.disabledInput]}
                            value={currentEmail}
                            editable={false}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={newEmail}
                            onChangeText={setNewEmail}
                            placeholder="Enter new email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Email</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmEmail}
                            onChangeText={setConfirmEmail}
                            placeholder="Confirm new email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={emailPassword}
                                onChangeText={setEmailPassword}
                                placeholder="Enter your current password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showEmailPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowEmailPassword(!showEmailPassword)}
                            >
                                <Ionicons
                                    name={showEmailPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdateEmail}>
                        <Text style={styles.updateButtonText}>Update Email</Text>
                    </TouchableOpacity>

                    <View style={styles.infoBox}>
                        <Ionicons name="information-circle-outline" size={20} color="#666" />
                        <Text style={styles.infoText}>
                            You'll receive a verification email at your new address.
                            Click the link to confirm the change.
                        </Text>
                    </View>
                </View>

                {/* Password Update Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="lock-closed-outline" size={20} color="#1a1446" /> Update Password
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Current Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                placeholder="Enter your current password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showCurrentPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                placeholder="Enter new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Ionicons
                                    name={showNewPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm New Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder="Confirm new password"
                                placeholderTextColor="#999"
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
                        <Text style={styles.updateButtonText}>Update Password</Text>
                    </TouchableOpacity>

                    <View style={styles.requirementsBox}>
                        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                        <View style={styles.requirement}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.requirementText}>At least 8 characters long</Text>
                        </View>
                        <View style={styles.requirement}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.requirementText}>One uppercase letter</Text>
                        </View>
                        <View style={styles.requirement}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.requirementText}>One lowercase letter</Text>
                        </View>
                        <View style={styles.requirement}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.requirementText}>One number</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    formContainer: {
        padding: 20,
        paddingTop: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1446',
        marginTop: 15,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1446',
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1446',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
        color: '#666',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
    },
    eyeButton: {
        padding: 12,
    },
    updateButton: {
        backgroundColor: '#1a1446',
        paddingVertical: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#e3f2fd',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: '#1976d2',
        lineHeight: 20,
    },
    requirementsBox: {
        backgroundColor: '#f0f8f0',
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
    },
    requirementsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1446',
        marginBottom: 10,
    },
    requirement: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    requirementText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
}); 