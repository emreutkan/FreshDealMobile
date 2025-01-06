// index.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Provider} from 'react-redux';
import {store} from '@/store/store';
import HomeScreen from './features/homeScreen/screens/Home';
import Landing from './features/LoginRegister/screens/Landing'; // Renamed from _layout

type RootStackParamList = {
    Landing: undefined;
    LoginPage: undefined;
    RegisterModal: undefined;
    HomeScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Landing>
                    <Stack.Navigator
                        initialRouteName="Landing"
                        screenOptions={{
                            presentation: 'modal', // Modals for login/register
                            headerShown: false,
                        }}
                    >

                        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                    </Stack.Navigator>
                </Landing>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
