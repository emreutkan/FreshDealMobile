import {createNavigationContainerRef} from '@react-navigation/native';
// import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    HomeScreen: undefined;
    AddressSelectionScreen: undefined;
    UpdateAddress: {
        addressId?: string;
    };
    RestaurantDetails: undefined;
    FavoritesScreen: undefined;
    Cart: undefined;
    Account: undefined;
    Orders: { status?: 'active' | 'previous' };
    OrderDetails: { orderId: number };
};

// If you're using useNavigation hook, you might want to add this type:
// export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export const navigationRef = createNavigationContainerRef<BottomTabNavigationProp<RootStackParamList>>();
export const navigationRef = createNavigationContainerRef<NativeStackNavigationProp<RootStackParamList>>();

