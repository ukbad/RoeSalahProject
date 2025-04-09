import React, { useContext } from 'react'; // Import React and useContext hook to access context
import { View, Text, StyleSheet, Switch, SafeAreaView, Image } from 'react-native'; // Import necessary React Native components
import { TimeFormatContext } from '../context/TimeFormatContext'; // Import the context for time format

// SettingsScreen component for displaying the time format settings
const SettingsScreen = () => {
  const { is24HourFormat, toggleTimeFormat } = useContext(TimeFormatContext); // Get the time format state and toggle function from context

  return (
    // SafeAreaView ensures the content is displayed within the safe area of the screen
    <SafeAreaView style={styles.container}>
      {/* Logo at the top of the settings screen */}
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      
      <View style={styles.setting}>
        {/* Label for the switch */}
        <Text style={styles.text}>Use 24-Hour Time Format:</Text>
        
        {/* Switch to toggle between 24-hour and 12-hour format */}
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }} // Color for the switch track (background)
          thumbColor={is24HourFormat ? "#f5dd4b" : "#f4f3f4"} // Color for the switch thumb (circle)
          ios_backgroundColor="#3e3e3e" // Background color for iOS when the switch is off
          onValueChange={toggleTimeFormat} // Function to toggle the time format
          value={is24HourFormat} // Current state value (true or false)
        />
      </View>
    </SafeAreaView>
  );
};

// Styles for the SettingsScreen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the full available space
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    backgroundColor: '#0B3D3D', // Set the background color of the screen
  },
  logo: {
    width: 120, // Width of the logo
    height: 120, // Height of the logo
    marginBottom: 20, // Space below the logo
  },
  setting: {
    flexDirection: 'row', // Arrange the label and switch horizontally
    justifyContent: 'space-between', // Space out the label and switch
    alignItems: 'center', // Center the items vertically
    width: '80%', // Set the width of the setting container
    marginVertical: 10, // Add vertical margin between settings
  },
  text: {
    fontSize: 18, // Font size for the setting label
    color: '#fff', // Text color for the setting label
  },
});

export default SettingsScreen; // Export the SettingsScreen component for use in other parts of the app