import {createNavigationContainerRef} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Login: undefined;
    HomeScreen: undefined;
    AddressSelectionScreen: undefined;
    UpdateAddress: { addressId: string }; // Ensure this is correct
    RestaurantDetails: { restaurantId: string };
    FavoritesScreen: undefined;
    Cart: {
        restaurantId: string
        isPickup: boolean;
        setIsPickup: (isPickup: boolean) => void;
    };

};

export const navigationRef = createNavigationContainerRef<BottomTabNavigationProp<RootStackParamList>>();

