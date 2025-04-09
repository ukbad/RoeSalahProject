import React, { useContext, useEffect, useState } from 'react'; // Import React and hooks for managing state and side effects
import { StatusBar } from 'expo-status-bar'; // Import StatusBar to manage the status bar appearance on the screen
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'; // Import necessary components from React Native for layout and UI

import { useFonts } from 'expo-font'; // Import useFonts hook to load custom fonts
import { Fonts } from '../../src/utils/fonts'; // Import custom font settings from utils
import { Colors } from '../../src/utils/colors'; // Import color palette from utils
import { Feather, FontAwesome5 } from '@expo/vector-icons'; // Import specific icons from FontAwesome and Feather libraries
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; // Import DateTimePicker for selecting dates and times
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for saving and retrieving data locally
import prayerTimes from '../../prayerTimes'; // Import prayer times data
import loadDatabase from '../database/loadDatabase'; // Import function to load the SQLite database
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect for handling screen focus events
import { TimeFormatContext } from '../context/TimeFormatContext'; // Import context to manage time format globally


// Define icons for each prayer time
const prayerIcons: Record<string, JSX.Element> = {
  Fajr: <Feather name="sunrise" size={18} color="#aadcee" />,
  Sunrise: <Feather name="sun" size={18} color="#f6d365" />,
  Dhuhr: <Feather name="clock" size={18} color="#f3c623" />,
  Asr: <Feather name="sunset" size={18} color="#fb8c00" />,
  Maghrib: <Feather name="moon" size={18} color="#e57373" />,
  Isha: <Feather name="moon" size={18} color="#7986cb" />,
};

export default function PrayerTimesScreen() {
  // Use time format context to respect user preference (12h or 24h)
  const { is24HourFormat } = useContext(TimeFormatContext);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [prayerTimesByDate, setPrayerTimesByDate] = useState<Record<string, string>>(prayerTimes);
  const [loading, setLoading] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    [Fonts.SourceSansProLight]: require('../../assets/fonts/Source_Sans_Pro/SourceSansPro-Light.ttf'),
    [Fonts.SourceSansPro]: require('../../assets/fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf'),
    [Fonts.SourceSansProSemiBold]: require('../../assets/fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf'),
    [Fonts.SourceSansProBold]: require('../../assets/fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf'),
    [Fonts.UbuntuLight]: require('../../assets/fonts/Ubuntu/Ubuntu-Light.ttf'),
    [Fonts.Ubuntu]: require('../../assets/fonts/Ubuntu/Ubuntu-Regular.ttf'),
    [Fonts.UbuntuMedium]: require('../../assets/fonts/Ubuntu/Ubuntu-Medium.ttf'),
    [Fonts.UbuntuBold]: require('../../assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),
  });

  // Fetch prayer times on mount and when date or time format changes
  useEffect(() => {
    fetchPrayerTimesFromSQLite(date);
  }, [date, is24HourFormat]);

  // Fetch prayer times from SQLite database
  const fetchPrayerTimesFromSQLite = async (selectedDate: Date) => {
    try {
      setLoading(true);

      const database = await loadDatabase();

      const weekday = selectedDate.toLocaleDateString('en-GB', { weekday: 'short' });
      const day = selectedDate.getDate();
      const month = selectedDate.toLocaleDateString('en-GB', { month: 'short' });
      const year = selectedDate.getFullYear();
      const formattedDate = `${weekday} ${day} ${month} ${year}`;

      const rows = await database.getAllAsync(
        'SELECT * FROM PrayerTimes WHERE "Date" = ?',
        [formattedDate]
      );

      // If found, set from DB; else fallback to static JSON
      if (rows.length > 0) {
        const item = rows[0];
        setPrayerTimesByDate({
          Fajr: (item as any).Fajr || prayerTimes.Fajr,
          Sunrise: (item as any).Sunrise || prayerTimes.Sunrise,
          Dhuhr: (item as any).Dhuhr || prayerTimes.Dhuhr,
          Asr: (item as any).Asr || prayerTimes.Asr,
          Maghrib: (item as any).Maghrib || prayerTimes.Maghrib,
          Isha: (item as any).Isha || prayerTimes.Isha,
        });
      } else {
        setPrayerTimesByDate(prayerTimes);
      }

      setLoading(false);
    } catch (error) {
      console.error('[SQLite Error]', error);
      setPrayerTimesByDate(prayerTimes); // Fallback
      setLoading(false);
    }
  };

  // Go to previous day
  const handlePrevDay = () => {
    const prevDay = new Date(date);
    prevDay.setDate(date.getDate() - 1);
    setDate(prevDay);
  };

  // Go to next day
  const handleNextDay = () => {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    setDate(nextDay);
  };

  // Handle date selection from picker
  const handleDateTimeChange = (_: DateTimePickerEvent, newDate?: Date) => {
    if (newDate) {
      setDate(newDate);
      setShowDatePicker(false);
    }
  };

  // const formatTime = (time: string) => {
  //   try {
  //     let [hours, modifier] = time.split(' ');
  //     let [hh, mm] = hours.split(':');

  //     if (modifier === 'PM' && hh !== '12') {
  //       hh = (parseInt(hh) + 12).toString();
  //     } else if (modifier === 'AM' && hh === '12') {
  //       hh = '00';
  //     }

  //     const dateTime = new Date(`2022-01-01T${hh}:${mm}:00`);
  //     return dateTime.toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //       hour12: !is24HourFormat,
  //     });
  //   } catch (error) {
  //     console.error(`Error formatting time: ${time}`, error);
  //     return 'Invalid';
  //   }
  // };

    // Format time based on user preference (12h or 24h)
  const formatTime = (time: string) => {
    try {
      if (!time || !time.includes(':')) return 'N/A';
  
      // Handle "5:00 AM" or "12:45 PM" format
      if (time.includes('AM') || time.includes('PM')) {
        let [hours, modifier] = time.split(' ');
        let [hh, mm] = hours.split(':');
  
        hh = hh.padStart(2, '0');
        mm = mm.padStart(2, '0');
  
        if (modifier === 'PM' && hh !== '12') {
          hh = (parseInt(hh, 10) + 12).toString();
        } else if (modifier === 'AM' && hh === '12') {
          hh = '00';
        }
  
        const dateTime = new Date(`2000-01-01T${hh}:${mm}:00`);
        return dateTime.toLocaleTimeString(is24HourFormat ? 'en-GB' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: !is24HourFormat,
        });        
      }
  
      // Handle "05:00" format (24-hr fallback)
      let [hh, mm] = time.split(':');
      hh = hh.padStart(2, '0');
      mm = mm.padStart(2, '0');
  
      const dateTime = new Date(`2000-01-01T${hh}:${mm}:00`);
      return dateTime.toLocaleTimeString(is24HourFormat ? 'en-GB' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24HourFormat,
      });      
    } catch (error) {
      console.error(`Error formatting time: ${time}`, error);
      return 'N/A';
    }
  };
  
  

  if (!fontsLoaded) return null;
// Prevent rendering until fonts are loaded
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.Dark }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.titleRow}>
          <Text style={{ ...styles.meeqatItemLabel, ...styles.title }}>RoeSalah Prayers Time</Text>
        </View>
        <View style={styles.dateBar}>
          <TouchableOpacity onPress={handlePrevDay} style={styles.chevronButton}>
            <Feather name="chevron-left" size={24} color={Colors.Light} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.date}>
              {date.toDateString() === new Date().toDateString() && (
                <FontAwesome5 name="dot-circle" color={Colors.Gray} size={24} />
              )}{' '}
              &nbsp;
              {date.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextDay} style={styles.chevronButton}>
            <Feather name="chevron-right" size={24} color={Colors.Light} />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateTimeChange}
            themeVariant="dark"
          />
        )}

        <View style={styles.timingContainer}>
          {loading ? (
            <Text style={{ color: Colors.White, fontFamily: Fonts.Ubuntu }}>Loading prayer times...</Text>
          ) : Object.keys(prayerTimesByDate).length > 0 ? (
            Object.entries(prayerTimesByDate).map(([name, time]) => (
              <View style={styles.meeqatItem} key={name}>
                <Text style={styles.meeqatItemLabel}>
                {name} {prayerIcons[name]}
              </Text>
              <Text style={styles.meeqatItemValue}>{formatTime(time)}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: Colors.Gray, fontFamily: Fonts.Ubuntu }}>
              No prayer times found for this date.
            </Text>
          )}
        </View>

        <View>
          <Text style={styles.copyright}>&copy; Roe Salah (Roe_Salah.dev)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LightGreen,
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    padding: 12,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.SourceSansProBold,
    color: Colors.Light,
  },
  date: {
    fontSize: 24,
    fontFamily: Fonts.SourceSansPro,
    color: Colors.Light,
  },
  dateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  timingContainer: {
    flex: 1,
    gap: 12,
  },
  meeqatItem: {
    flexDirection: 'row',
    gap: 5,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    padding: 16,
    borderColor: Colors.Gray,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  meeqatItemLabel: {
    flex: 1,
    fontSize: 18,
    color: Colors.White,
    fontFamily: Fonts.Ubuntu,
  },
  meeqatItemValue: {
    flex: 1,
    fontSize: 18,
    color: Colors.White,
    textAlign: 'right',
    fontFamily: Fonts.UbuntuBold,
  },
  copyright: {
    color: Colors.Gray,
    textAlign: 'center',
    fontFamily: Fonts.SourceSansPro,
    fontSize: 18,
  },
  chevronButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    padding: 8,
    borderRadius: 50,
    borderColor: Colors.Gray,
  },
});
