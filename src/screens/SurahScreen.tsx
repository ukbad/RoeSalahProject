import React, { useEffect, useState } from 'react'; // Import React and hooks for managing state and side effects
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native'; // Import necessary React Native components

// Define the structure of a Verse object
interface Verse {
    id: number;
    text_uthmani: string;
    verse_key: string;
}

// Define the type of props that the SurahScreen component will receive
interface SurahScreenProps {
    route: {
        params: {
            surahId: number; // ID of the Surah
            surahName: string; // Name of the Surah
        };
    };
}

// SurahScreen component to display the verses of a specific Surah
const SurahScreen: React.FC<SurahScreenProps> = ({ route }) => {
    const { surahId, surahName } = route.params; // Destructure surahId and surahName from the route params
    const [verses, setVerses] = useState<Verse[]>([]); // State to store the list of verses
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading state

    // useEffect hook to fetch the verses of the selected Surah when the component mounts or surahId changes
    useEffect(() => {
        fetch(`https://api.quran.com/api/v4/chapters/${surahId}/verses?language=en&limit=300`)
            .then(response => response.json()) // Parse the JSON response
            .then(data => {
                setVerses(data.verses); // Set the verses data to the state
                setLoading(false); // Stop loading once data is fetched
            })
            .catch(error => {
                console.error('Error fetching verses:', error); // Log any errors
                setLoading(false); // Stop loading if there's an error
            });
    }, [surahId]); // Dependency array ensures this effect runs whenever surahId changes

    // Show a loading spinner while the data is being fetched
    if (loading) {
        return <ActivityIndicator size="large" color="#00C7BE" style={styles.loading} />;
    }

    // Render each verse in the list
    const renderItem = ({ item }: { item: Verse }) => (
        <View style={styles.verseContainer}>
            <Text style={styles.verseText}>
                {item.verse_key}: {item.text_uthmani}
            </Text> {/* Display verse key and text */}
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{surahName}</Text> {/* Display the Surah name */}
            <FlatList
                data={verses} // Data source is the verses state
                renderItem={renderItem} // Function to render each verse item
                keyExtractor={item => item.id.toString()} // Unique key for each item in the list
            />
        </View>
    );
};

// Styles for the components
const styles = StyleSheet.create({
    container: {
        flex: 1, // Make the container take up the full available space
        backgroundColor: '#F0FFF0', // Set a light background color for the screen
        padding: 10, // Padding around the content
    },
    title: {
        fontSize: 24, // Font size for the Surah title
        marginBottom: 20, // Space below the title
        color: '#2F4F4F', // Title text color
        textAlign: 'center', // Center-align the title
    },
    verseContainer: {
        padding: 10, // Padding inside each verse item container
        borderBottomWidth: 1, // Border between verse items
        borderBottomColor: '#ddd', // Light gray border color
    },
    verseText: {
        fontSize: 18, // Font size for the verse text
        color: '#00C7BE', // Verse text color
    },
    loading: {
        flex: 1, // Make the loading spinner container take up full space
        justifyContent: 'center', // Center the spinner vertically
        alignItems: 'center', // Center the spinner horizontally
    },
});

export default SurahScreen; // Export the SurahScreen component for use in other parts of the app