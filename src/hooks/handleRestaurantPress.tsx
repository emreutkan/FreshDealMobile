import {useCallback} from 'react';
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "@/src/redux/store";
import {RootState} from "@/src/types/store";
import {setSelectedRestaurant} from "@/src/redux/slices/restaurantSlice";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {getRestaurantThunk} from "@/src/redux/thunks/restaurantThunks";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'RestaurantDetails'>;

// Create a custom hook
export const useHandleRestaurantPress = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    // Move the selector inside the hook
    const restaurantsInProximity = useSelector((state: RootState) => state.restaurant.restaurantsProximity);

    // Use useCallback to memoize the function
    return useCallback((restaurantId: number) => {
        const restaurant = restaurantsInProximity.find((r) => r.id === restaurantId);
        console.log('Selected restaurant:', restaurant);

        if (!restaurant) {
            console.error('Restaurant not found.');
            return;
        }

        dispatch(setSelectedRestaurant(restaurant));
        dispatch(getRestaurantThunk(restaurant.id))

        navigation.navigate('RestaurantDetails');
    }, [dispatch, navigation, restaurantsInProximity]);
};