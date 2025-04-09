import * as Location from 'expo-location'; // Import Location module from Expo for location-related functionality
import { Magnetometer } from 'expo-sensors'; // Import Magnetometer from Expo Sensors to use the device's compass
import PropTypes from 'prop-types'; // Import PropTypes to enforce type checking on component props
import React, {
    useState,
    useEffect,
    useCallback,
    forwardRef,
    useImperativeHandle,
} from 'react'; // Import React hooks and components
import { Image, View, Text, StyleSheet, ActivityIndicator } from 'react-native'; // Import core components from React Native
import { moderateScale } from 'react-native-size-matters'; // Import moderateScale for responsive design scaling

// Custom hook to manage the Qibla Compass logic
export const useQiblaCompass = () => {
    const [subscription, setSubscription] = useState(null); // State to hold subscription to the magnetometer
    const [magnetometer, setMagnetometer] = useState(0); // State to hold magnetometer data
    const [qiblad, setQiblad] = useState(0); // State to hold the calculated Qibla direction
    const [error, setError] = useState(null); // State to hold any error messages
    const [isLoading, setIsLoading] = useState(true); // State to handle loading state
    const [useDefaultLocation, setUseDefaultLocation] = useState(false); // State to check if default location should be used

    // Default coordinates for London in case location permissions are not granted
    const DEFAULT_LAT = 51.5074;
    const DEFAULT_LON = -0.1278;

    // Function to initialize the compass and request location permissions
    const initCompass = useCallback(async () => {
        // Check if the magnetometer is available on the device
        const isAvailable = await Magnetometer.isAvailableAsync();
        if (!isAvailable) {
            setError('Compass is not available on this device');
            setIsLoading(false);
            return;
        }

        // Request location permission from the user
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setError('Location permission not granted, using default location (London)');
            setUseDefaultLocation(true);
            calculate(DEFAULT_LAT, DEFAULT_LON);  // Use London coordinates if permission is denied
            setIsLoading(false);
            subscribe(); // Start receiving magnetometer updates
            return;
        }

        try {
            // Get the current device location
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            calculate(latitude, longitude); // Calculate the Qibla direction based on the current location
        } finally {
            setIsLoading(false); // Stop the loading state
            subscribe(); // Start receiving magnetometer updates
        }
    }, []);

    // useEffect hook to initialize the compass when the component mounts
    useEffect(() => {
        initCompass();

        return () => {
            unsubscribe(); // Clean up the subscription when the component unmounts
        };
    }, []);

    // Function to subscribe to magnetometer updates
    const subscribe = () => {
        Magnetometer.setUpdateInterval(100); // Set the update interval for the magnetometer
        setSubscription(
            Magnetometer.addListener((data) => {
                setMagnetometer(angle(data)); // Update the magnetometer state with the new angle
            })
        );
    };

    // Function to unsubscribe from magnetometer updates
    const unsubscribe = () => {
        subscription && subscription.remove(); // Remove the listener if it exists
        setSubscription(null); // Reset the subscription state
    };

    // Function to calculate the angle based on the magnetometer data
    const angle = (magnetometer) => {
        let angle = 0;
        if (magnetometer) {
            const { x, y } = magnetometer;
            if (Math.atan2(y, x) >= 0) {
                angle = Math.atan2(y, x) * (180 / Math.PI);
            } else {
                angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
            }
        }
        return Math.round(angle); // Return the rounded angle
    };

    // Function to determine the compass direction based on the degree
    const direction = (degree) => {
        if (degree >= 22.5 && degree < 67.5) {
            return 'NE';
        } else if (degree >= 67.5 && degree < 112.5) {
            return 'E';
        } else if (degree >= 112.5 && degree < 157.5) {
            return 'SE';
        } else if (degree >= 157.5 && degree < 202.5) {
            return 'S';
        } else if (degree >= 202.5 && degree < 247.5) {
            return 'SW';
        } else if (degree >= 247.5 && degree < 292.5) {
            return 'W';
        } else if (degree >= 292.5 && degree < 337.5) {
            return 'NW';
        } else {
            return 'N'; // Return 'N' for North
        }
    };

    // Function to adjust the magnetometer degree for correct rotation
    const degree = (magnetometer) => {
        return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
    };

    // Function to calculate the Qibla direction based on latitude and longitude
    const calculate = (latitude, longitude) => {
        const PI = Math.PI;
        const latk = (21.4225 * PI) / 180.0; // Latitude of the Kaaba in radians
        const longk = (39.8264 * PI) / 180.0; // Longitude of the Kaaba in radians
        const phi = (latitude * PI) / 180.0; // Latitude of the current location in radians
        const lambda = (longitude * PI) / 180.0; // Longitude of the current location in radians
        const qiblad =
            (180.0 / PI) *
            Math.atan2(
                Math.sin(longk - lambda),
                Math.cos(phi) * Math.tan(latk) -
                Math.sin(phi) * Math.cos(longk - lambda)
            );
        setQiblad(qiblad); // Update the Qibla direction state
    };

    // Calculate compass and Qibla directions
    const compassDirection = direction(degree(magnetometer));
    const compassDegree = degree(magnetometer);
    const compassRotate = 360 - degree(magnetometer); // Rotate the compass
    const kabaRotate = 360 - degree(magnetometer) + qiblad; // Rotate the Kaaba icon based on the Qibla direction

    // Return the current Qibla compass state
    return {
        qiblad,
        compassDirection,
        compassDegree,
        compassRotate,
        kabaRotate,
        error,
        isLoading,
        reinitCompass: initCompass, // Allow the compass to be reinitialized
        useDefaultLocation,
    };
};

// Functional component that renders the Qibla Compass UI
const QiblaCompass = forwardRef(
    (
        { backgroundColor = 'transparent', color = '#0B3D3D', textStyles = {}, compassImage, kaabaImage },
        ref
    ) => {
        const {
            qiblad,
            compassDirection,
            compassDegree,
            compassRotate,
            kabaRotate,
            error,
            isLoading,
            reinitCompass,
        } = useQiblaCompass(); // Use the custom hook to get the Qibla compass state

        // Expose the reinitCompass function to parent components
        useImperativeHandle(
            ref,
            () => {
                return {
                    reinitCompass,
                };
            },
            []
        );

        // Show loading spinner while data is loading
        if (isLoading) {
            return (
                <View style={[styles.container, { backgroundColor }]}>
                    <ActivityIndicator size={50} color={color} />
                </View>
            );
        }

        return (
            <View style={[styles.container, { backgroundColor }]}>
                {/* Display error message if there is an error */}
                {error && (
                    <Text
                        style={{
                            color: '#f00',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            paddingHorizontal: 20,
                            fontSize: moderateScale(16, 0.25),
                            ...textStyles,
                        }}
                    >
                        Error: {error}
                    </Text>
                )}
                {/* Display compass direction and degree */}
                <View style={styles.direction}>
                    <Text
                        style={[styles.directionText, { color, ...textStyles }]}
                    >
                        {compassDirection}
                    </Text>
                    <Text
                        style={[styles.directionText, { color, ...textStyles }]}
                    >
                        {compassDegree}°
                    </Text>
                </View>
                {/* Display compass and Kaaba images */}
                <View
                    style={{
                        width: '100%',
                        height: moderateScale(300, 0.25),
                        position: 'relative',
                    }}
                >
                    <Image
                        source={compassImage || require('../../assets/compass.png')}
                        style={[
                            styles.image,
                            {
                                transform: [
                                    {
                                        rotate: `${compassRotate}deg`, // Rotate the compass image
                                    },
                                ],
                                zIndex: 100,
                            },
                        ]}
                    />
                    <View
                        style={{
                            width: moderateScale(300, 0.25),
                            height: moderateScale(300, 0.25),
                            position: 'absolute',
                            alignSelf: 'center',
                            transform: [
                                {
                                    rotate: `${kabaRotate}deg`, // Rotate the Kaaba image
                                },
                            ],
                            flexDirection: 'row',
                            justifyContent: 'center',
                            zIndex: 999,
                            elevation: 999,
                        }}
                    >
                        <Image
                            source={kaabaImage || require('../../assets/kaaba.png')}
                            style={{
                                resizeMode: 'center',
                                height: 100,
                                width: 40,
                                zIndex: 1000,
                            }}
                        />
                    </View>
                </View>
                {/* Display Qibla direction */}
                <View style={styles.qiblaDirection}>
                    <Image
                        source={require('../../assets/kaaba.png')}
                        style={{
                            width: moderateScale(35, 0.25),
                            height: moderateScale(35, 0.25),
                        }}
                    />
                    <Text
                        style={[styles.directionText, { color, ...textStyles }]}
                    >
                        {qiblad.toFixed(2)} {/* Show Qibla angle */}
                    </Text>
                </View>
            </View>
        );
    }
);

// Define prop types for the component
QiblaCompass.propTypes = {
    backgroundColor: PropTypes.string,
    color: PropTypes.string,
    textStyles: PropTypes.object,
    compassImage: PropTypes.any,
    kaabaImage: PropTypes.any,
};

// Styles for the component
const styles = StyleSheet.create({
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        position: 'absolute',
        top: 0,
        width: moderateScale(300, 0.25),
        height: moderateScale(300, 0.25),
    },
    container: {
        backgroundColor: '#0B3D3D',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    direction: {
        textAlign: 'center',
        zIndex: 300,
    },
    directionText: {
        textAlign: 'center',
        fontSize: 30,
        color: '#468773',
    },
    qiblaDirection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default QiblaCompass; // Export the QiblaCompass component for use in other parts of the app