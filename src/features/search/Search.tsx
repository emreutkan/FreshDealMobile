import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/src/redux/store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/utils/navigation";
import {useNavigation} from "@react-navigation/native";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {getRestaurantsByProximity} from "@/src/redux/thunks/restaurantThunks";
import {SearchforRestaurantsThunk} from "@/src/redux/thunks/searchThunks";
import RestaurantList from "@/src/features/homeScreen/components/RestaurantCard";
import debounce from 'lodash/debounce';
import Icon from 'react-native-vector-icons/Ionicons'; // Make sure to install this package


const Search: React.FC = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const searchAnimation = new Animated.Value(0);

    const dispatch = useDispatch<AppDispatch>();
    const inputRef = React.useRef<TextInput>(null);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const insets = useSafeAreaInsets();
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [inputFocused, setInputFocused] = useState(false);


    // Selectors
    const searchResults = useSelector((state: RootState) =>
        state.search.searchResults?.results ?? []
    );
    const restaurants = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximity ?? []
    );
    const isLoading = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximityLoading
    );

    // Filtered restaurants logic
    const filteredRestaurants = searchText === ""
        ? restaurants
        : restaurants.filter((restaurant) =>
            searchResults
                .map(result => result.id)
                .includes(Number(restaurant?.id))
        );

    // Debounced search function
    const debouncedSearch = React.useCallback(
        debounce((text: string) => {
            if (text) {
                setIsSearching(true);
                dispatch(SearchforRestaurantsThunk({
                    type: 'restaurant',
                    query: text,
                })).finally(() => setIsSearching(false));
            }
        }, 500),
        []
    );

    const handleSearch = (text: string) => {
        setSearchText(text);
        debouncedSearch(text);

        // Save to recent searches when user submits
        if (text && !recentSearches.includes(text)) {
            setRecentSearches(prev => [text, ...prev].slice(0, 5)); // Keep last 5 searches
        }

        Animated.spring(searchAnimation, {
            toValue: text.length > 0 ? 1 : 0,
            useNativeDriver: true,
            tension: 50,
            friction: 7
        }).start();
    };
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getRestaurantsByProximity())
            .finally(() => setRefreshing(false));
    }, []);

    // Clear search
    const handleClearSearch = () => {
        setSearchText("");
        inputRef.current?.clear();
        Keyboard.dismiss();
    };

    useEffect(() => {
        dispatch(getRestaurantsByProximity());
    }, []);

    const NoResults = () => (
        <View style={styles.noResultsContainer}>
            <Icon name="search-outline" size={50} color="#666"/>
            <Text style={styles.noResultsText}>
                No restaurants found for "{searchText}"
            </Text>
        </View>
    );
    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={[styles.safeArea, {paddingTop: insets.top}]}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <Icon
                                name="search-outline"
                                size={20}
                                color="#666"
                                style={styles.searchIcon}
                            />
                            <TextInput
                                ref={inputRef}
                                style={styles.searchInput}
                                placeholder="Search for restaurants..."
                                placeholderTextColor="#999"
                                onChangeText={handleSearch}
                                value={searchText}
                                returnKeyType="search"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {searchText.length > 0 && (
                                <TouchableWithoutFeedback onPress={handleClearSearch}>
                                    <Icon
                                        name="close-circle"
                                        size={20}
                                        color="#666"
                                        style={styles.clearIcon}
                                    />
                                </TouchableWithoutFeedback>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Results Section */}
            <View style={styles.resultsContainer}>
                {isSearching ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#b2f7a5"/>
                    </View>
                ) : (
                    <>
                        {searchText.length > 0 && (
                            <Text style={styles.resultCount}>
                                {filteredRestaurants.length} results found
                            </Text>
                        )}
                            <ScrollView
                                style={styles.scrollView}
                                showsVerticalScrollIndicator={false}
                                bounces={true}
                                contentContainerStyle={styles.scrollViewContent}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        tintColor="rgb(176,244,132)"
                                        colors={["rgb(176,244,132)"]}
                                    />
                                }
                            >
                                <RestaurantList
                                    restaurants={filteredRestaurants}
                                />
                            </ScrollView>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchInputFocused: {
        borderColor: 'rgb(176,244,132)', // Match your theme color
        borderWidth: 2,
    },
    noResultsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: scaleFont(50),
    },
    noResultsText: {
        fontSize: scaleFont(16),
        color: '#666',
        textAlign: 'center',
        marginTop: scaleFont(10),
    },
    recentSearchesContainer: {
        padding: scaleFont(15),
    },
    recentSearchTitle: {
        fontSize: scaleFont(16),
        fontWeight: '600',
        marginBottom: scaleFont(10),
    },
    safeArea: {
        backgroundColor: "rgb(176,244,132)",
        borderColor: '#b2f7a5',
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 999,
    },
    searchContainer: {
        padding: scaleFont(15),
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        borderRadius: scaleFont(25),
        paddingHorizontal: scaleFont(15),
        height: scaleFont(50),
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android
    },
    searchIcon: {
        marginRight: scaleFont(10),
    },
    searchInput: {
        flex: 1,
        fontSize: scaleFont(16),
        color: '#333',
        paddingVertical: scaleFont(10),
    },
    clearIcon: {
        padding: scaleFont(5),
    },
    resultsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultCount: {
        padding: scaleFont(15),
        color: '#666',
        fontSize: scaleFont(14),
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: scaleFont(15),
        paddingBottom: scaleFont(20),
    },
});

export default Search;