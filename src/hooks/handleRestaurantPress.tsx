import {useCallback} from 'react';
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {getRestaurantThunk} from "@/src/redux/thunks/restaurantThunks";
import {Restaurant} from '@/src/types/api/restaurant/model';
import {Alert} from 'react-native'; // Placeholder for feedback

// Helper function to convert HH:MM string to minutes from midnight
const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

// Helper function to get current day as a string (e.g., "Monday")
const getCurrentDay = (): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
};

// Helper function to get current time in minutes from midnight
const getCurrentTimeInMinutes = (): number => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

export const useHandleRestaurantPress = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    const restaurantsInProximity = useSelector((state: RootState) => state.restaurant.restaurantsProximity);

    return useCallback((restaurantId: number, restaurant?: Restaurant) => {
        const restaurantDetails = restaurant || restaurantsInProximity.find((r) => r.id === restaurantId);

        if (!restaurantDetails) {
            console.error('Restaurant not found.');
            return;
        }

        const isRestaurantCurrentlyClosed = (res: Restaurant): boolean => {
            if (!res.workingDays || res.workingDays.length === 0 || !res.workingHoursStart || !res.workingHoursEnd) {
                // If working hours/days are not defined, assume it's closed or handle as an error
                console.warn(`Restaurant ${res.restaurantName} (ID: ${res.id}) has incomplete working hours/days information.`);
                return true; // Default to closed if info is missing
            }

            const currentDay = getCurrentDay();
            const currentTimeMinutes = getCurrentTimeInMinutes();

            if (!res.workingDays.includes(currentDay)) {
                return true; // Closed on this day
            }

            const startTimeMinutes = timeToMinutes(res.workingHoursStart);
            const endTimeMinutes = timeToMinutes(res.workingHoursEnd);

            // Handle cases where closing time is past midnight (e.g. 22:00 - 02:00)
            if (endTimeMinutes < startTimeMinutes) { // e.g. opens 22:00, closes 02:00
                // If current time is after start OR before end (on the next day concept)
                return !(currentTimeMinutes >= startTimeMinutes || currentTimeMinutes < endTimeMinutes);
            } else { // Normal same-day hours
                return !(currentTimeMinutes >= startTimeMinutes && currentTimeMinutes < endTimeMinutes);
            }
        };

        const isRestaurantEffectivelyOutOfStock = (res: Restaurant): boolean => {
            return res.listings === 0;
        };

        const isClosed = isRestaurantCurrentlyClosed(restaurantDetails);
        const isOutOfStock = isRestaurantEffectivelyOutOfStock(restaurantDetails);

        if (isClosed || isOutOfStock) {
            let message = "This restaurant is currently ";
            if (isClosed && isOutOfStock) {
                message += "closed and out of stock.";
            } else if (isClosed) {
                message += "closed.";
            } else {
                message += "out of stock.";
            }
            // TODO: Replace this Alert with your desired brief visual feedback (e.g., shake animation on the card)
            Alert.alert("Restaurant Unavailable", message);
            return; // Prevent navigation
        }

        dispatch(setSelectedRestaurant(restaurantDetails));
        dispatch(getRestaurantThunk(restaurantDetails.id));
        navigation.navigate('RestaurantDetails');
    }, [dispatch, navigation, restaurantsInProximity]);
};
