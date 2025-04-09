import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from '@expo/vector-icons/FontAwesome';

// Component representing the main screen of the app
const ModernHomeScreen = ({ navigation }) => {
    const [currentTime, setCurrentTime] = useState(''); // State to store the current time

    useEffect(() => {
        // Function to update the time every second
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';

            // Convert hours into 12-hour format and format minutes to always show two digits
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

            // Combine the time components into a single string
            const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
            setCurrentTime(formattedTime);
        };

        updateTime(); // Set the initial time
        const intervalId = setInterval(updateTime, 1000); // Update time every second

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.currentPrayer}>Prayers</Text>
                <Text style={styles.time}>{currentTime}</Text>
                <Text style={styles.timer}>{new Date().toDateString()}</Text>
            </View>

            <View style={styles.gridContainer}>
                
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PrayerTime')}>
                    <Icon name="clock-o" size={30} color="#fff" />
                    <Text style={styles.cardText}>Prayer Times</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('QiblaDirection')}>
                    <Icon name="compass" size={30} color="#fff" />
                    <Text style={styles.cardText}>Qibla Direction</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Calendar')}>
                    <Icon name="calendar" size={30} color="#fff" />
                    <Text style={styles.cardText}>Calendar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Quran')}>
                    <Icon name="book" size={30} color="#fff" />
                    <Text style={styles.cardText}>Quran</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.locationContainer}>
                <Text style={styles.dateText}>RoeSalah Prayer Times 2025</Text>
                <Text style={styles.locationText}>UK, London, Roehampton</Text>
            </View>

            <View style={styles.quoteContainer}>
                <Text style={styles.quoteText}>"Indeed, Allah is with the patient." (Quran 2:153)</Text>
            </View>
        </ScrollView>
    );
};

// StyleSheet to style the components
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B3D3D',
    },
    header: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#163E3E',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    appTitle: {
        fontSize: 24,
        color: '#fff',
        marginBottom: 5,
    },
    currentPrayer: {
        fontSize: 20,
        color: '#fff',
    },
    time: {
        fontSize: 40,
        color: '#FFD700',
    },
    timer: {
        fontSize: 16,
        color: '#A0A0A0',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: 10,
    },
    card: {
        width: '40%',
        margin: 10,
        padding: 20,
        backgroundColor: '#295353',
        borderRadius: 15,
        alignItems: 'center',
        elevation: 5,
    },
    cardText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    locationContainer: {
        padding: 10,
        alignItems: 'center',
        backgroundColor: '#163E3E',
        marginVertical: 10,
        borderRadius: 10,
    },
    dateText: {
        color: '#FFD700',
        fontSize: 16,
    },
    locationText: {
        color: '#fff',
        fontSize: 18,
    },
    quoteContainer: {
        padding: 10,
        backgroundColor: '#295353',
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    quoteText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    }
});

export default ModernHomeScreen;