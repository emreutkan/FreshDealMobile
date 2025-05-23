import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    LayoutAnimation,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Platform,
    StatusBar,
    StyleSheet,
    UIManager,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddressSelectorScreen from '@/src/features/AddressSelectionScreen/addressSelectionScreen';
import HomeCardView from '@/src/features/homeScreen/screens/HomeCardView';
import HomeMapView from '@/src/features/homeScreen/screens/HomeMapView';
import AccountScreen from '@/src/features/accountScreen/accountScreen';
import Header from '@/src/features/homeScreen/components/Header';
import Search from "@/src/features/search/Search";
import {getRecentRestaurantsThunk, getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";
import {getFavoritesThunk} from "@/src/redux/thunks/userThunks";
import {lightHaptic} from "@/src/utils/Haptics";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SCROLL_THRESHOLD = 50;
const Tab = createBottomTabNavigator();

const HomeScreen: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.address.addresses);
    const primaryAddressId = useSelector((state: RootState) => state.address.selectedAddressId);
    const primaryAddressData = addresses.find((address) => address.id === primaryAddressId?.toString());
    const dispatch = useDispatch<AppDispatch>();
    const scrollY = useRef(new Animated.Value(0)).current;

    // States for header and scroll behavior
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [, setHomeCardHeaderState] = useState(false);
    const [activeTab, setActiveTab] = useState('HomeCardView');
    const restaurantsProximity = useSelector((state: RootState) => state.restaurant.restaurantsProximity);
    const favoriteRestaurantsIDs = useSelector((state: RootState) => state.restaurant.favoriteRestaurantsIDs);

    useEffect(() => {
        lightHaptic().then(r => console.log(r));
    }, [activeTab]);

    useFocusEffect(
        React.useCallback(() => {
            if (primaryAddressData) {
                console.log('Primary Address Data:', primaryAddressData);
                dispatch(getRestaurantsByProximity());
                dispatch(getFavoritesThunk());
                dispatch(getRecentRestaurantsThunk());
            }
        }, [dispatch, primaryAddressData])
    );

    useEffect(() => {
        console.log('restaurantsProximity:', restaurantsProximity);
        console.log('favoriteRestaurantsIDs:', favoriteRestaurantsIDs);
    }, [restaurantsProximity, favoriteRestaurantsIDs]);

    const handleTabChange = (routeName: string) => {
        setIsHeaderVisible(routeName !== 'Account' && routeName !== 'Search'); // Hide header for Account and Search
        setActiveTab(routeName); // Update active tab state
        if (routeName === 'HomeCardView') {
        } else if (routeName === 'HomeMapView') {
            setIsHeaderCollapsed(true); // Always collapse header for HomeMapView
        }
    };

    const handleScroll = Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollY}}}],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const currentOffsetY = event.nativeEvent.contentOffset.y;
                const shouldCollapseHeader = currentOffsetY > SCROLL_THRESHOLD;

                if (shouldCollapseHeader !== isHeaderCollapsed) {
                    LayoutAnimation.configureNext({
                        duration: 200,
                        update: {type: LayoutAnimation.Types.easeInEaseOut},
                    });
                    setIsHeaderCollapsed(shouldCollapseHeader);
                    setHomeCardHeaderState(shouldCollapseHeader);
                }
            }
        }
    );

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }

    return (
        <BottomSheetModalProvider>

            <View style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content"/>

                {isHeaderVisible && (
                    <Header
                        activeTab={activeTab}
                        scrollY={scrollY}
                    />
                )}

                <View
                    style={[
                        styles.contentContainer,
                        activeTab === 'HomeMapView' ? styles.mapContentContainer : styles.contentContainer,
                    ]}
                >
                    <Tab.Navigator
                        screenListeners={{
                            state: (e) => {
                                const routeName = e.data.state?.routes[e.data.state.index]?.name;
                                handleTabChange(routeName);
                            },
                        }}
                        screenOptions={({route}) => ({
                            headerShown: false,
                            tabBarIcon: ({focused, color}) => {
                                const iconMap = {
                                    HomeCardView: focused ? 'home' : 'home-outline',
                                    HomeMapView: focused ? 'map' : 'map-outline',
                                    Account: focused ? 'person' : 'person-outline',
                                    Search: focused ? 'search' : 'search-outline',
                                };
                                return <Ionicons name={iconMap[route.name as keyof typeof iconMap]} size={20}
                                                 color={color}/>;
                            },
                            tabBarActiveTintColor: 'rgba(76,175,80,0.75)',
                            tabBarInactiveTintColor: '#8e8e8e',
                            tabBarLabelStyle: styles.tabBarLabel,
                            tabBarStyle: styles.tabBar,
                        })}
                    >
                        <Tab.Screen name="HomeCardView" options={{tabBarLabel: 'Home'}}>
                            {() => (
                                <HomeCardView
                                    onScroll={handleScroll}
                                />
                            )}
                        </Tab.Screen>
                        <Tab.Screen name="HomeMapView" component={HomeMapView} options={{tabBarLabel: 'Map'}}/>
                        <Tab.Screen name="Search" component={Search} options={{tabBarLabel: 'Search'}}/>
                        <Tab.Screen name="Account" component={AccountScreen} options={{tabBarLabel: 'Account'}}/>
                    </Tab.Navigator>
                </View>
            </View>
        </BottomSheetModalProvider>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    contentContainer: {
        flex: 1,
        zIndex: 0,
    },
    mapContentContainer: {
        flex: 1,
        zIndex: 0,
        marginTop: -150,
    },
    tabBar: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 5,
        borderTopColor: '#1c1b1b',
    },
    tabBarLabel: {
        fontFamily: 'Poppins-Medium',
        fontSize: 11,

    },
});

export default HomeScreen;