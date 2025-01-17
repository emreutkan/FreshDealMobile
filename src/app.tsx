import React from 'react';
import {StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from '@/src/redux/store';
import HomeScreen from './features/homeScreen/screens/Home';
import Landing from './features/LoginRegister/screens/Landing';
import AddressSelectionScreen from "@/src/features/homeScreen/screens/addressSelectionScreen";
import {navigationRef, RootStackParamList} from '@/src/utils/navigation';
import UpdateAddress from "@/src/features/homeScreen/screens/UpdateAddress";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RestaurantDetails from "@/src/features/RestaurantScreen/RestaurantDetails";
import FavoritesScreen from "@/src/features/homeScreen/screens/FavoritesScreen";
import CartScreen from "@/src/features/CartScreen/CartScreen";
import Orders from "@/src/features/OrdersScreen/Orders"; // Add this import
import OrderDetails from "@/src/features/OrdersScreen/OrderDetails"; // Add this import
import AccountScreen from "@/src/features/accountScreen/accountScreen";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContent: React.FC = () => {
    return (
        <GestureHandlerRootView style={styles.container}>
            <BottomSheetModalProvider>

                <Provider store={store}>
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
                            <Stack.Screen name="UpdateAddress" component={UpdateAddress}/>

                            <Stack.Screen
                                name="RestaurantDetails"
                                component={RestaurantDetails}
                            />
                            <Stack.Screen
                                name="FavoritesScreen"
                                component={FavoritesScreen}
                                options={{title: 'Favorites'}}
                            />
                            <Stack.Screen name="Cart" component={CartScreen}/>

                            {/* Add these new screens */}
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
                        </Stack.Navigator>
                    </NavigationContainer>
                </Provider>
            </BottomSheetModalProvider>

        </GestureHandlerRootView>
    );
};

export default AppContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 0,
        padding: 0,
    },
});