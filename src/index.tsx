import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import HomeScreen from './features/homeScreen/screens/Home';
import Landing from './features/LoginRegister/screens/Landing';
import AddressSelectionScreen from "@/src/features/homeScreen/screens/addressSelectionScreen"; // Renamed from _layout
import {navigationRef, RootStackParamList} from '@/src/types/navigation';
import UpdateAddress from "@/src/features/homeScreen/screens/UpdateAddress";
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RestaurantDetails from "@/src/features/RestaurantScreen/RestaurantDetails";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{flex: 1, padding: 0, margin: 0}}>
            <Provider store={store}>
                <NavigationContainer ref={navigationRef}>
                    <Stack.Navigator
                        initialRouteName="Landing"
                        screenOptions={{
                            headerShown: false,
                            statusBarTranslucent: true, // Allows content to overlap the status bar (remove safe area in android)
                        }}
                    >

                        <Stack.Screen name="Landing" component={Landing}/>
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
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
};

export default App;
