// src/app.tsx
import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {navigationRef, RootStackParamList} from '@/src/utils/navigation';
import {NotificationsProvider} from '@/src/providers/NotificationProvider';

import HomeScreen from './features/homeScreen/screens/Home';
import Landing from './features/LoginRegister/screens/Landing';
import AddressSelectionScreen from "./features/AddressSelectionScreen/addressSelectionScreen";
import RestaurantDetails from "./features/RestaurantScreen/RestaurantDetails";
import FavoritesScreen from "./features/favoritesScreen/FavoritesScreen";
import CartScreen from "./features/CartScreen/CartScreen";
import Orders from "./features/OrdersScreen/Orders";
import OrderDetails from "./features/OrdersScreen/OrderDetails";
import AccountScreen from "./features/accountScreen/accountScreen";
import CheckoutScreen from "./features/CheckoutScreen/CheckoutScreen";
import RestaurantComments from "./features/RestaurantComments/RestaurantComments";
import RankingsScreen from "@/src/features/rankingsScreen/RankingsScreen";
import AchievementsScreen from "@/src/features/AchievementsScreen/AchievementsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <NotificationsProvider>
                <BottomSheetModalProvider>
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator
                            initialRouteName="Login"
                            screenOptions={{
                                headerShown: false,
                                statusBarTranslucent: true,
                            }}
                        >
                            <Stack.Screen name="Login" component={Landing}/>
                            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                            <Stack.Screen
                                name="AddressSelectionScreen"
                                component={AddressSelectionScreen}
                            />
                            <Stack.Screen
                                name="RestaurantDetails"
                                component={RestaurantDetails}
                            />
                            <Stack.Screen
                                name="RestaurantComments"
                                component={RestaurantComments}
                            />
                            <Stack.Screen
                                name="FavoritesScreen"
                                component={FavoritesScreen}
                                options={{title: 'Favorites'}}
                            />
                            <Stack.Screen name="Cart" component={CartScreen}/>
                            <Stack.Screen name="Account" component={AccountScreen}/>
                            <Stack.Screen
                                name="Orders"
                                component={Orders}
                                options={({route}) => ({
                                    title: route.params?.status === 'active' ? 'Active Orders' : 'Previous Orders'
                                })}
                            />
                            <Stack.Screen
                                name="OrderDetails"
                                component={OrderDetails}
                                options={{title: 'Order Details'}}
                            />
                            <Stack.Screen name="Checkout" component={CheckoutScreen}/>
                            <Stack.Screen name="Rankings" component={RankingsScreen} options={{headerShown: false}}/>
                            <Stack.Screen name="Achievements" component={AchievementsScreen}
                                          options={{headerShown: false}}/>
                        </Stack.Navigator>
                    </NavigationContainer>
                </BottomSheetModalProvider>
            </NotificationsProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default AppContent;