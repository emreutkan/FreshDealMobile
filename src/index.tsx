import 'react-native-get-random-values'; // Import this at the top
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import HomeScreen from './features/homeScreen/screens/Home';
import Landing from './features/LoginRegister/screens/Landing';
import AddressSelectionScreen from "@/src/features/homeScreen/screens/addressSelectionScreen"; // Renamed from _layout
import {RootStackParamList} from '@/src/types/navigation';
import UpdateAddress from "@/src/features/homeScreen/screens/UpdateAddress";
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <GestureHandlerRootView style={{flex: 1}}>
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Landing"
                        screenOptions={{headerShown: false}}
                    >
                        <Stack.Screen name="Landing" component={Landing}/>
                        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                        <Stack.Screen
                            name="AddressSelectionScreen"
                            component={AddressSelectionScreen}
                        />
                        <Stack.Screen name="UpdateAddress" component={UpdateAddress}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </Provider>
        </GestureHandlerRootView>
    );
};

export default App;
