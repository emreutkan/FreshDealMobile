import React, {useState} from 'react';
import {
    ActivityIndicator,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import RestaurantList from "@/src/features/homeScreen/components/RestaurantCard";
import {Feather} from '@expo/vector-icons';
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface HomeCardViewProps {
    onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
    onRestaurantPress?: (restaurantId: string) => void;
}

const HomeCardView: React.FC<HomeCardViewProps> = ({onScroll, onRestaurantPress}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {restaurantsProximity, loading, error} = useSelector(
        (state: RootState) => state.restaurant
    );

    // State for filters
    const [filters, setFilters] = useState({
        pickup: true,
        delivery: false,
        under30: false,
    });

    const [isPriceExpanded, setIsPriceExpanded] = useState(false); // Tracks if price dropdown is expanded
    const [selectedPrice, setSelectedPrice] = useState<'$' | '$$' | '$$$' | null>(null);

    const handleToggleFilter = (filterId: 'pickup' | 'delivery' | 'under30') => {
        setFilters((prevFilters) => {
            const isCurrentlySelected = prevFilters[filterId];
            const otherFilter = filterId === 'pickup' ? 'delivery' : 'pickup';

            // Ensure at least one of pickup or delivery is always selected
            if ((filterId === 'pickup' || filterId === 'delivery') && isCurrentlySelected && !prevFilters[otherFilter]) {
                return {
                    ...prevFilters,
                    [filterId]: false,
                    [otherFilter]: true,
                };
            }

            return {
                ...prevFilters,
                [filterId]: !isCurrentlySelected,
            };
        });
    };

    const togglePriceDropdown = () => {
        setIsPriceExpanded((prev) => !prev);
    };

    const handlePriceSelect = (price: '$' | '$$' | '$$$') => {
        setSelectedPrice(price);
        setIsPriceExpanded(false); // Collapse the dropdown after selection
    };

    return (
        <View style={styles.safeArea}>
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Text style={styles.title}>Restaurants in Area</Text>
            </View>

            {/* Filter Bar */}
            <ScrollView
                horizontal
                style={styles.filterBar}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterContentContainer}
            >
                {/* Icon Button */}
                <TouchableOpacity style={styles.iconButton}>
                    <Feather name="sliders" size={16} color="#333"/>
                </TouchableOpacity>

                {/* Pick Up Button */}
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        filters.pickup && styles.filterButtonSelected,
                    ]}
                    onPress={() => handleToggleFilter('pickup')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filters.pickup && styles.filterTextSelected,
                        ]}
                    >
                        Pick Up
                    </Text>
                </TouchableOpacity>

                {/* Delivery Button */}
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        filters.delivery && styles.filterButtonSelected,
                    ]}
                    onPress={() => handleToggleFilter('delivery')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filters.delivery && styles.filterTextSelected,
                        ]}
                    >
                        Delivery
                    </Text>
                </TouchableOpacity>

                {/* Price Button */}
                <TouchableOpacity
                    style={[styles.filterButton, isPriceExpanded && styles.filterButtonSelected]}
                    onPress={togglePriceDropdown}
                >
                    <Text
                        style={[
                            styles.filterText,
                            isPriceExpanded && styles.filterTextSelected,
                        ]}
                    >
                        Price
                    </Text>
                    <Feather
                        name={isPriceExpanded ? 'chevron-up' : 'chevron-down'}
                        size={14}
                        color={isPriceExpanded ? '#FFF' : '#333'}
                        style={styles.dropdownIcon}
                    />
                </TouchableOpacity>

                {/* Under 30 min Button */}
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        filters.under30 && styles.filterButtonSelected,
                    ]}
                    onPress={() => handleToggleFilter('under30')}
                >
                    <Text
                        style={[
                            styles.filterText,
                            filters.under30 && styles.filterTextSelected,
                        ]}
                    >
                        Under 30 min
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Expandable Price Section */}
            {isPriceExpanded && (
                <View style={styles.priceDropdown}>
                    {['$', '$$', '$$$'].map((price) => (
                        <TouchableOpacity
                            key={price}
                            style={[
                                styles.priceOption,
                                selectedPrice === price && styles.filterButtonSelected,
                            ]}
                            onPress={() => handlePriceSelect(price as '$' | '$$' | '$$$')}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    selectedPrice === price && styles.filterTextSelected,
                                ]}
                            >
                                {price}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* Main Content */}
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#50703C"/>
                        <Text style={styles.loadingText}>Loading restaurants...</Text>
                    </View>
                ) : error || restaurantsProximity.length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <Feather name="frown" size={48} color="#555"/>
                        <Text style={styles.noDataTitle}>No Restaurants Found</Text>
                        <Text style={styles.noDataMessage}>
                            There are no restaurants available in your area currently.
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        onScroll={onScroll}
                        style={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={true}
                        decelerationRate="normal"
                        scrollEventThrottle={16}
                        renderToHardwareTextureAndroid
                        overScrollMode="never"
                        bounces={false}
                    >
                        <RestaurantList
                            restaurants={restaurantsProximity}
                            onRestaurantPress={(id) => {
                                console.log('Selected restaurant:', id);
                            }}
                        />
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    topBar: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    filterBar: {
        backgroundColor: '#FFFFFF',
        paddingVertical: scaleFont(12),

        maxHeight: scaleFont(45),
    },
    filterContentContainer: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center',

    },
    iconButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F1F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        height: 36,
        backgroundColor: '#F1F1F1',
        borderRadius: 18,
        marginHorizontal: 4,
    },
    filterButtonSelected: {
        backgroundColor: '#50703C',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    filterTextSelected: {
        color: '#FFF',
    },
    dropdownIcon: {
        marginLeft: 6,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#555',
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    noDataTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
        textAlign: 'center',
    },
    noDataMessage: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginVertical: 10,
    },
    priceDropdown: {
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        elevation: 3,
    },
    priceOption: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F1F1F1',
    },
});

export default HomeCardView;
