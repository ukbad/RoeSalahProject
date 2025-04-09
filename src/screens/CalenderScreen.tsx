import React, { useState } from 'react'; // Import React and useState hook for managing state
import { View, Text, StyleSheet, Image } from 'react-native'; // Import components from React Native
import { Calendar } from 'react-native-calendars'; // Import the Calendar component from the 'react-native-calendars' library

const CalendarScreen = () => {
    // State hook to track the selected date in the calendar
    const [selectedDate, setSelectedDate] = useState('');

    return (
        <View style={styles.container}>
            {/* Title text for the calendar screen */}
            <Text style={styles.title}>RoeSalah Calendar</Text>
            
            <View style={styles.calendarContainer}>
                {/* Calendar component that allows selecting dates */}
                <Calendar
                    onDayPress={(day) => setSelectedDate(day.dateString)} // Set the selected date when a day is pressed
                    markedDates={{
                        // Highlight the selected date with a special style
                        [selectedDate]: { selected: true, marked: true, selectedColor: '#FFD700' },
                    }}
                    theme={{
                        // Custom styles for the calendar component
                        backgroundColor: '#fff',
                        calendarBackground: '#F0FFF0',
                        textSectionTitleColor: '#2F4F4F',
                        selectedDayBackgroundColor: '#00C7BE',
                        selectedDayTextColor: '#fff',
                        todayTextColor: '#00C7BE',
                        dayTextColor: '#2F4F4F',
                        arrowColor: '#00C7BE',
                    }}
                />
            </View>
            
            {/* Display the selected date if any */}
            {selectedDate ? (
                <View style={styles.selectedDateContainer}>
                    <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
                </View>
            ) : null}
        </View>
    );
};

// Styles for the components using StyleSheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B3D3D', // Background color of the screen
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: 'white', // Title text color
    },
    calendarContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#00C7BE', // Border color around the calendar
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3, // Adds a shadow effect to the calendar container
    },
    selectedDateContainer: {
        marginTop: 20,
        backgroundColor: '#00C7BE', // Background color of the selected date container
        padding: 10,
        borderRadius: 5,
    },
    selectedDateText: {
        color: '#fff', // Text color for the selected date
        fontSize: 16,
    },
});

export default CalendarScreen; // Export the CalendarScreen component for use in other parts of the app