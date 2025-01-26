const token = tokenService.getToken();

// src/middleware/tokenMiddleware.ts
import {Middleware} from '@reduxjs/toolkit';
import {tokenService} from "@/src/services/tokenService";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {CommonActions, useNavigation} from "@react-navigation/native";

export const tokenMiddleware: Middleware = (store) => (next) => (action: unknown) => {
    // Type guard to check if action is a valid Redux action
    if (typeof action === 'object' && action !== null && 'type' in action) {
        const token = tokenService.getToken();
        type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

        const navigation = useNavigation<NavigationProp>();
        if (!token) {
            if (action.type !== 'user/logout') {
                store.dispatch({type: 'user/logout'});

                // Reset the navigation state and navigate to Login
                if (navigation) {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                {name: 'Login'}
                            ],
                        })
                    );
                }
            }
            return;
        }
    }

    return next(action);
};