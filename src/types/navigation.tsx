import {createNavigationContainerRef} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
    Landing: undefined;
    HomeScreen: undefined;
    AddressSelectionScreen: undefined;
    UpdateAddress: { addressId: string }; // Ensure this is correct
    RestaurantDetails: { restaurantId: string };

};

export const navigationRef = createNavigationContainerRef<BottomTabNavigationProp<RootStackParamList>>();

export function navigate(name: keyof RootStackParamList, params?: any) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}