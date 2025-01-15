import React, {useEffect} from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View,
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

interface RestaurantSearchProps {
    onRestaurantPress?: (restaurantId: string) => void; // Add this new prop
}

const dismissKeyboard = () => {
    Keyboard.dismiss();
};

const Search: React.FC<RestaurantSearchProps> = ({onRestaurantPress}) => {
    const [searchText, setSearchText] = React.useState<string>("");

    const dispatch = useDispatch<AppDispatch>();
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const inputRef = React.useRef<TextInput>(null);
    // const {restaurantsProximity, restaurantsProximityLoading, restaurantsProximityStatus} = useSelector(
    //     (state: RootState) => state.restaurant
    // );


    // Move all useSelector calls to the top level
    const searchResults = useSelector((state: RootState) =>
        state.search.searchResults?.results ?? []
    );
    const restaurants = useSelector((state: RootState) =>
        state.restaurant.restaurantsProximity ?? []
    );

    // Then calculate filteredRestaurants based on the data
    const filteredRestaurants = searchText === ""
        ? restaurants
        : restaurants.filter((restaurant) =>
            searchResults
                .map(result => result.id)
                .includes(Number(restaurant?.id))
        );


    useEffect(() => {

        if (searchText.toString() !== "") {
            const request = {
                type: 'restaurant',
                query: searchText,
            }
            dispatch(SearchforRestaurantsThunk(request));
        }

        console.log('Search Text:', searchText);
        console.log(restaurants)
        console.log("Filtered Restaurants:", filteredRestaurants);

    }, [searchText]);

    const handleSearch = (text: string) => {
        setSearchText(text);

    }

    const navigation = useNavigation<NavigationProp>();
    useEffect(() => {
        const radius = 12;
        dispatch(getRestaurantsByProximity({radius}));
    }, []);
    // Handler for restaurant selection
    const handleRestaurantPress = (restaurantId: string) => {
        if (onRestaurantPress) {
            onRestaurantPress(restaurantId);
        }
    };


    const inset = useSafeAreaInsets()
    return (
        <>
            <KeyboardAvoidingView
                style={[styles.safeArea, {paddingTop: inset.top}]}
                behavior="padding">
                <TouchableWithoutFeedback onPress={dismissKeyboard}>
                    <View style={{flex: 1}}>
                        <View
                            style={{
                                paddingTop: scaleFont(10),
                                paddingHorizontal: scaleFont(10),
                            }}>
                            <TextInput
                                style={{
                                    paddingVertical: scaleFont(10),
                                    paddingHorizontal: scaleFont(15),
                                    borderRadius: scaleFont(20),
                                    backgroundColor: '#f9f9f9',
                                    borderColor: '#b2f7a5',
                                    borderWidth: 1,
                                    shadowColor: '#000',
                                    shadowOffset: {width: 0, height: 1},
                                    shadowOpacity: 0.1,
                                    shadowRadius: 1,
                                    elevation: 1,
                                }}
                                ref={inputRef}
                                placeholder="Search for restaurants..."
                                placeholderTextColor="#999"
                                onChangeText={handleSearch}
                            />
                        </View>

                    </View>
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
            <ScrollView
                style={{
                    flex: 1,
                    height: '100%', // Ensure it occupies full height
                    borderWidth: 0, // Remove extra borders for cleaner layout
                }}
                showsVerticalScrollIndicator={true} // Show scroll indicator for debugging
                bounces={true} // Allow bounce for visual clarity
            >
                <>

                    <RestaurantList
                        restaurants={filteredRestaurants}
                        onRestaurantPress={(id) => {
                            console.log('Selected restaurant:', id);
                            if (onRestaurantPress) onRestaurantPress(id);
                        }}
                    />
                </>
            </ScrollView></>
    );
};


const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
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


});

export default Search;
