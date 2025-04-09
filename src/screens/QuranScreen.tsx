import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const QuranScreen = ({ navigation }) => {  // Accepts navigation prop if you want to add navigation later
    const [surahs, setSurahs] = useState([]);  // State to store Surah list

    useEffect(() => {
        // Fetch list of Surahs from Quran API when component mounts
        fetch('https://api.quran.com/api/v4/chapters')
            .then(response => response.json())
            .then(data => setSurahs(data.chapters))  // Save Surahs to state
            .catch(error => console.error('Error fetching Surahs:', error));
    }, []);

    // Render each Surah item
    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.surahContainer}
            // onPress={() => navigation.navigate('SurahDetail', { surahId: item.id })} // Optional: Navigate to Surah detail
        >
            <Text style={styles.surahName}>{item.name_simple}</Text>
            <Text style={styles.surahDetails}>Surah {item.id} - {item.verses_count} Ayahs</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Screen title */}
            <Text style={styles.title}>Quran</Text>

            {/* List of Surahs */}
            <FlatList
                data={surahs}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </View>
    );
};

// Styling for the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B3D3D',  // Dark teal background
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white',
        textAlign: 'center',
    },
    surahContainer: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    surahName: {
        fontSize: 18,
        color: '#00C7BE',  // Highlighted Surah name color
    },
    surahDetails: {
        fontSize: 14,
        color: 'white',  // Subtitle color
    },
});

export default QuranScreen;
