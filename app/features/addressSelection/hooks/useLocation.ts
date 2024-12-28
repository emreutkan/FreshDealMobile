// hooks/useLocation.ts
import {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import {Alert} from 'react-native';

export const useLocation = () => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchLocation = async () => {
        try {
            console.log('Fetching location...');
            const {status: existingStatus} = await Location.getForegroundPermissionsAsync();
            console.log('Existing permission status:', existingStatus);
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const {status} = await Location.requestForegroundPermissionsAsync();
                console.log('Requested permission status:', status);
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permission Denied', 'Location permission is required to use this feature.');
                setLoading(false);
                return;
            }

            const lastKnown = await Location.getLastKnownPositionAsync();
            if (lastKnown) setLocation(lastKnown);
            else {
                const loc = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
                setLocation(loc);
            }

        } catch (error) {
            console.error('Error fetching location:', error);
            Alert.alert('Error', 'An error occurred while fetching the location.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, []);

    return {location, loading, fetchLocation};
};
