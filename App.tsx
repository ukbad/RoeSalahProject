import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, Image } from 'react-native';

// Importing all screens
import ModernHomeScreen from './src/screens/HomeScreen';
import PrayerTimeScreen from './src/screens/prayerTimes';
import WelcomeScreen from './src/screens/WelcomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import QiblaDirectionScreen from './src/screens/QiblaDirectionScreen';
import CalendarScreen from './src/screens/CalenderScreen';
import QuranScreen from './src/screens/QuranScreen';

// Importing context provider for time format
import { TimeFormatProvider } from './src/context/TimeFormatContext';

// Initialize Stack and Tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack navigator for Home section (including Welcome, Home, and other screens)
const HomeStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerStyle: {
                backgroundColor: '#163E3E',
                elevation: 0,
                shadowOpacity: 0,
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
        }}
    >
        {/* Initial Welcome screen with header hidden */}
        <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
        />
        
        {/* Home screen with custom header title containing logo and text */}
        <Stack.Screen
            name="HomeScreen"
            component={ModernHomeScreen}
            options={{
                headerTitle: () => (
                    <View style={styles.headerContainer}>
                        <Image
                            source={require('./assets/logo.png')}
                            style={styles.logo}
                        />
                        <Text style={styles.headerTitle}>RoeSalah</Text>
                    </View>
                ),
            }}
        />

        {/* Other stack screens with simple text titles */}
        <Stack.Screen name="PrayerTime" component={PrayerTimeScreen} options={{ title: 'Prayer Times' }} />
        <Stack.Screen name="QiblaDirection" component={QiblaDirectionScreen} options={{ title: 'Qibla Direction' }} />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Islamic Calendar' }} />
        <Stack.Screen name="Quran" component={QuranScreen} options={{ title: 'Quran' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
);

// Main App component wrapped in TimeFormatProvider
export default function App() {
    return (
        <TimeFormatProvider>
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ color, size }) => {
                            let iconName;

                            // Define icon based on route name
                            if (route.name === 'Home') {
                                iconName = 'home';
                            } else if (route.name === 'PrayerTimes') {
                                iconName = 'clock-o';
                            } else if (route.name === 'QiblaDirection') {
                                iconName = 'compass';
                            } else if (route.name === 'Calendar') {
                                iconName = 'calendar';
                            } else if (route.name === 'Quran') {
                                iconName = 'book';
                            } else if (route.name === 'Setting') {
                                iconName = 'cog';
                            }

                            // Render FontAwesome icon
                            return <Icon name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#FFD700',
                        tabBarInactiveTintColor: '#A0A0A0',
                        tabBarStyle: {
                            backgroundColor: '#163E3E',
                            paddingBottom: 5,
                            paddingTop: 5,
                            height: 60,
                        },
                        headerShown: false, // Hide default header for tabs
                    })}
                >
                    {/* Define each tab with its respective screen */}
                    <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
                    <Tab.Screen name="PrayerTimes" component={PrayerTimeScreen} options={{ tabBarLabel: 'Prayer Times' }} />
                    <Tab.Screen name="QiblaDirection" component={QiblaDirectionScreen} options={{ tabBarLabel: 'Qibla' }} />
                    <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
                    <Tab.Screen name="Quran" component={QuranScreen} options={{ tabBarLabel: 'Quran' }} />
                    <Tab.Screen name="Setting" component={SettingsScreen} options={{ tabBarLabel: 'Setting' }} />
                </Tab.Navigator>
            </NavigationContainer>
        </TimeFormatProvider>
    );
}

// Styles for custom header title
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
