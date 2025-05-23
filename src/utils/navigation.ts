import {createNavigationContainerRef} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Address} from '@/src/types/api/address/model';

export type RootStackParamList = {
    Login: undefined;
    HomeScreen: undefined;
    AddressSelectionScreen: { addressToEdit?: Address };
    UpdateAddress: {
        addressId?: string;
    };
    RestaurantDetails: undefined;
    RestaurantComments: undefined;
    FavoritesScreen: undefined;
    Cart: undefined;
    Account: undefined;
    Orders: { status?: 'active' | 'previous' };
    OrderDetails: { orderId: number };
    Checkout: undefined;
    Rankings: undefined;
    Achievements: undefined;
    DebugMenu: undefined;
};

// If you're using useNavigation hook, you might want to add this type:
// export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// export const navigationRef = createNavigationContainerRef<BottomTabNavigationProp<RootStackParamList>>();
export const navigationRef = createNavigationContainerRef<NativeStackNavigationProp<RootStackParamList>>();

