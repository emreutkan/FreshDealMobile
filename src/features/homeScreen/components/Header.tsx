import React, {useEffect} from 'react';
import {Animated, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AddressBar from '@/src/features/homeScreen/components/AddressBar';
import {scaleFont} from '@/src/utils/ResponsiveFont';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CartIcon from '@/src/features/RestaurantScreen/components/CartIcon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
// Standardized import path using alias
import {
    setDeliveryOrPickup,
    setSelectedCategory,
    setShowClosedRestaurants
} from '@/src/redux/slices/globalFiltersSlice';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {RestaurantCategoryType} from '@/src/types/api/restaurant/model';

interface HeaderProps {
    activeTab: string;
    scrollY?: Animated.Value;
}

export const Header: React.FC<HeaderProps> = ({activeTab, scrollY}) => {
    useEffect(() => {
        if (scrollY) {
            const scrollListener = scrollY.addListener(() => {
            });

            return () => {
                scrollY.removeListener(scrollListener);
            };
        } else {
            console.log("No scrollY provided to Header");
        }
    }, [scrollY]);

    const insets = useSafeAreaInsets();
    const headerBackgroundColor = scrollY?.interpolate({
        inputRange: [200, 300],
        outputRange: ['#ffffff', '#b0f484'],
        extrapolate: 'clamp'
    }) || '#ffffff';

    const contentColor = scrollY?.interpolate({
        inputRange: [0, 50],
        outputRange: ['#000000', '#ffffff'],
        extrapolate: 'clamp'
    }) || '#000000';

    const isMapView = activeTab === 'HomeMapView';
    const dispatch = useDispatch();
    const globalFilters = useSelector((state: RootState) => state.globalFilters);
    const showClosedRestaurants = globalFilters?.showClosedRestaurants ?? true;
    const deliveryOrPickup = globalFilters?.deliveryOrPickup ?? 'any';
    const selectedCategory = globalFilters?.selectedCategory ?? 'all';

    const toggleShowClosedRestaurants = () => {
        dispatch(setShowClosedRestaurants(!showClosedRestaurants));
    };

    const cycleDeliveryOrPickup = () => {
        const options: Array<'any' | 'delivery' | 'pickup'> = ['any', 'delivery', 'pickup'];
        const currentIndex = options.indexOf(deliveryOrPickup);
        const nextIndex = (currentIndex + 1) % options.length;
        dispatch(setDeliveryOrPickup(options[nextIndex]));
    };

    const categories: Array<RestaurantCategoryType | 'all'> = ['all', 'pizza', 'burgers', 'sushi', 'dessert'];
    const cycleSelectedCategory = () => {
        const currentIndex = categories.indexOf(selectedCategory);
        const nextIndex = (currentIndex + 1) % categories.length;
        dispatch(setSelectedCategory(categories[nextIndex]));
    };

    return (
        <Animated.View
            style={[
                styles.header,
                {
                    paddingTop: insets.top,
                    backgroundColor: isMapView ? 'rgba(255, 255, 255, 0.65)' : headerBackgroundColor,
                },
                isMapView && styles.icyHeader,
            ]}
        >
            <View style={[
                styles.container,
                isMapView && styles.icyContainer
            ]}>
                <View style={styles.topRow}>
                    <View style={styles.addressBarContainer}>
                        <AddressBar textColor={contentColor || '#000000'}/>
                    </View>
                    <View style={styles.iconContainer}>
                        <CartIcon/>
                    </View>
                </View>
                {!isMapView && (
                    <View style={styles.filterContainer}>
                        <TouchableOpacity onPress={toggleShowClosedRestaurants} style={styles.filterButton}>
                            <MaterialCommunityIcons name={showClosedRestaurants ? "eye" : "eye-off"} size={20}
                                                    color="#50703C"/>
                            <Text style={styles.filterText}>Closed: {showClosedRestaurants ? 'Show' : 'Hide'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cycleDeliveryOrPickup} style={styles.filterButton}>
                            <MaterialCommunityIcons
                                name={deliveryOrPickup === 'delivery' ? "truck-delivery" : deliveryOrPickup === 'pickup' ? "storefront" : "silverware-fork-knife"}
                                size={20}
                                color="#50703C"/>
                            <Text
                                style={styles.filterText}>{deliveryOrPickup.charAt(0).toUpperCase() + deliveryOrPickup.slice(1)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={cycleSelectedCategory} style={styles.filterButton}>
                            <MaterialCommunityIcons name="format-list-bulleted-type" size={20} color="#50703C"/>
                            <Text
                                style={styles.filterText}>{selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderTopWidth: 0,
        height: scaleFont(110),
    },
    icyHeader: {
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: Platform.select({
            ios: 'rgba(255, 255, 255, 0.65)',
            android: 'rgba(255, 255, 255, 0.75)',
        }),
        backdropFilter: 'blur(10px)',
        shadowColor: '#fff',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: Platform.select({
            ios: 0.5,
            android: 1,
        }),
    },
    icyContainer: {
        backgroundColor: Platform.select({
            ios: 'rgba(255, 255, 255, 0.15)',
            android: 'rgba(255, 255, 255, 0.2)',
        }),
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleFont(10),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressBarContainer: {
        maxWidth: '65%',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
    },
    filterText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#50703C',
        fontFamily: 'Poppins-Medium',
    },
});

export default Header;

