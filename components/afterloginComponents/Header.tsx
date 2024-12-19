// Header.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddressBar from "@/components/afterloginComponents/AddressBar";
import SearchBar from "@/components/afterloginComponents/SearchBar";
import {scaleFont} from "@/components/utils/ResponsiveFont";

interface HeaderProps {
    isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({isScrolled}) => {
    return (
        <View style={[styles.rowContainer,
            isScrolled && styles.rowScrolled]}>
            <View style={[
                styles.addressContainer,
                isScrolled && styles.addressContainerScrolled
            ]}>
                <AddressBar/>
                <SearchBar isScrolled={isScrolled}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({

    rowScrolled: {},

    addressContainerScrolled: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addressContainer: {
        // flex: 1, // Take remaining width
        justifyContent: 'center',
    },
    rowContainer: {
        flexDirection: 'column', // Default: AddressBar + SearchBar stacked
        justifyContent: 'flex-start',
        width: '100%',
        borderWidth: 1,
        borderColor: '#FFD700', // Gold
        paddingRight: scaleFont(10),

    },
    searchIcon: {

        marginRight: scaleFont(10),

    },
    searchBarFull: {
        marginTop: scaleFont(10),
        width: '100%', // Full width below AddressBar
        paddingHorizontal: scaleFont(15),
    },
});

export default Header;
