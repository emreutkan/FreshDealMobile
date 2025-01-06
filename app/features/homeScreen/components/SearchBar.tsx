// components/LoginScreenComponents/AddressBar.tsx
import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View,} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {scaleFont} from "@/app/utils/ResponsiveFont";

interface SearchBarProps {
    isScrolled: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({isScrolled}) => {


    return (
        <View style={[
            isScrolled ? {paddingHorizontal: scaleFont(10)} : styles.searchBarContainer,
        ]}>
            {isScrolled ? (
                <TouchableOpacity>
                    <Feather name="search" size={24} color="#999"/>
                </TouchableOpacity>
            ) : (
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for restaurants..."
                    placeholderTextColor="#999"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    searchBarContainer: {

        paddingTop: scaleFont(10),
        paddingHorizontal: scaleFont(10),
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        borderRadius: scaleFont(20),
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        maxHeight: scaleFont(60),
        minWidth: scaleFont(120),
    },
});

export default SearchBar;
