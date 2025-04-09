import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

// WelcomeScreen component, receives navigation prop for navigating to HomeScreen
const WelcomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* App logo */}
            <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
            />

            {/* Title texts */}
            <Text style={styles.title}>Welcome to RoeSalah</Text>
            <Text style={styles.title}>Prayers Time</Text>

            {/* Subtitle prompting user to continue */}
            <Text style={styles.subtitle}>Click below to continue</Text>

            {/* "Get Started" button navigates to HomeScreen */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('HomeScreen')}>
                <View style={styles.innerButton}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </View>
            </TouchableOpacity>

            {/* Inspirational Quran quote */}
            <Text style={styles.inspirationalQuote}>
                {"So remember Me; I will remember you."}
            </Text>
            {/* (Quran 2:152) — left as a comment to avoid rendering it as raw text */}
        </View>
    );
};

// Styles for WelcomeScreen layout and elements
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B3D3D', // Deep teal background
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        color: '#FFD700', // Golden title text
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        marginBottom: 20,
    },
    button: {
        width: 200,
        height: 50,
        marginBottom: 30,
        backgroundColor: '#295353', // Muted teal button
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    innerButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    inspirationalQuote: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        paddingHorizontal: 30,
        paddingTop: 10,
    },
});

// Export the screen component for use in navigation
export default WelcomeScreen;