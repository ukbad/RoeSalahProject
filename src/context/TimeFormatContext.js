import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a context to hold the time format preference (12h or 24h)
export const TimeFormatContext = createContext();

// Provider component to wrap around app components that need access to time format state
export const TimeFormatProvider = ({ children }) => {
  // State to track whether 24-hour format is enabled (default: false)
  const [is24HourFormat, setIs24HourFormat] = useState(false);

  // Load saved time format preference from AsyncStorage when the app starts
  useEffect(() => {
    const loadTimeFormat = async () => {
      const format = await AsyncStorage.getItem('timeFormat');
      // Set state based on stored preference ('24' means true)
      setIs24HourFormat(format === '24');
    };
    loadTimeFormat();
  }, []);

  // Function to toggle between 12-hour and 24-hour format
  const toggleTimeFormat = async () => {
    const newFormat = !is24HourFormat;
    setIs24HourFormat(newFormat);
    // Persist the new preference in AsyncStorage
    await AsyncStorage.setItem('timeFormat', newFormat ? '24' : '12');
  };

  // Provide the time format state and toggler to all children components
  return (
    <TimeFormatContext.Provider value={{ is24HourFormat, toggleTimeFormat }}>
      {children}
    </TimeFormatContext.Provider>
  );
};