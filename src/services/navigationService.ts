// src/services/navigationService.ts

import {createNavigationContainerRef} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from "@/src/utils/navigation";

export const navigationRef = createNavigationContainerRef<NativeStackNavigationProp<RootStackParamList>>();

export function navigate<RouteName extends keyof RootStackParamList>(
    screen: RouteName,
    params?: RootStackParamList[RouteName]
) {
    if (navigationRef.isReady()) {
        // Use dispatch instead of navigate
        navigationRef.dispatch({
            type: 'NAVIGATE',
            payload: {
                name: screen,
                params
            }
        });
    }
}

// Alternative simpler implementation
export const NavigationService = {
    navigateToLogin: () => {
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{name: 'Login'}],
            });
        }
    },
    navigateToHome: () => {
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{name: 'HomeScreen'}],
            });
        }
    },
    navigateToRestaurantDetails: (restaurantId: string) => {
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{name: 'RestaurantDetails', params: {restaurantId}}],
            });
        }
    }
};