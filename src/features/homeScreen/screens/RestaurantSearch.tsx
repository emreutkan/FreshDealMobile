import React, {useEffect} from 'react';
import {Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, TouchableWithoutFeedback, View,} from 'react-native';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import type {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "@/src/types/navigation";
import {useNavigation} from "@react-navigation/native";
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface RestaurantSearchProps {
    onRestaurantPress?: (restaurantId: string) => void; // Add this new prop
}

const dismissKeyboard = () => {
    Keyboard.dismiss();
};

const RestaurantSearch: React.FC<RestaurantSearchProps> = ({onRestaurantPress}) => {

    const dispatch = useDispatch<AppDispatch>();
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const inputRef = React.useRef<TextInput>(null);

    const navigation = useNavigation<NavigationProp>();
    const {restaurantsProximity, loading, error} = useSelector(
        (state: RootState) => state.restaurant
    );
    useEffect(() => {

        setTimeout(() => {
            console.log('Focusing TextInput with delay');
            inputRef.current?.focus();

        }, 0); // 100ms delay to ensure rendering is complete
    });
    // Handler for restaurant selection
    const handleRestaurantPress = (restaurantId: string) => {
        if (onRestaurantPress) {
            onRestaurantPress(restaurantId);
        }
    };

    const inset = useSafeAreaInsets()
    return (
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
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

export default RestaurantSearch;
