// RestaurantSearch.tsx
import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import {scaleFont} from "@/src/utils/ResponsiveFont";

const RestaurantSearch = () => {
    return (
        <View style={styles.searchBarContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search for restaurants..."
                placeholderTextColor="#999"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {
        marginTop: scaleFont(10),
    },
    searchBar: {
        backgroundColor: '#f2f2f2',
        borderRadius: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        paddingVertical: scaleFont(8),
        fontSize: scaleFont(14),
        color: '#333',
    },
});

export default RestaurantSearch;
