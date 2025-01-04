// Layout.tsx
import React from 'react';
import HomeCardView from "@/app/features/homeScreen/screens/HomeCardView";
import HomeMapView from "@/app/features/homeScreen/screens/HomeMapView";
import AccountScreen from "@/app/features/accountDetails/components/accountScreen";
import {NativeScrollEvent, NativeSyntheticEvent, StyleSheet,} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';


const Tab = createBottomTabNavigator();

interface HomeProps {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

const Home: React.FC<HomeProps> = ({onScroll}) => {


    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 14,
                    fontWeight: 'bold',
                },
            }}
        >
            
            <Tab.Screen
                name="HomeCardView"
                options={{tabBarLabel: 'Home'}}
            >
                {() => <HomeCardView onScroll={onScroll}/>}
            </Tab.Screen>
            <Tab.Screen
                name="HomeMapView"
                options={{tabBarLabel: 'Map'}}
            >
                {() => <HomeMapView/>}
            </Tab.Screen>
            <Tab.Screen
                name="Account"
                component={AccountScreen}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    contentContainer: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 50, // Ensure content isn't hidden behind navbar
    },
    screen: {
        flex: 1,
    },
    placeholderText: {
        marginTop: 20,
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
    },
});

export default Home;
