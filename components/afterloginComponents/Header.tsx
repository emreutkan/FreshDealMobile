// Header.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddressBar from "@/components/afterloginComponents/AddressBar";
import SearchBar from "@/components/afterloginComponents/SearchBar";
import {scaleFont} from "@/components/utils/ResponsiveFont";
import AccountBar from "@/components/afterloginComponents/AccountBar";

interface HeaderProps {
    isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({isScrolled}) => {
    return isScrolled ? (
        // Scrolled Layout: All components inline
        <View style={[styles.container, styles.containerScrolled]}>
            <AddressBar/>
            <View style={styles.inlineRightSection}>
                <AccountBar/>
                <SearchBar isScrolled={isScrolled}/>
            </View>
        </View>
    ) : (
        // Default Layout: Stacked SearchBar
        <View style={styles.container}>
            <View style={styles.row}>
                <AddressBar/>
                <AccountBar/>
            </View>
            <SearchBar isScrolled={isScrolled}/>
        </View>
    );
};

const styles = StyleSheet.create({

    container: {
        width: '100%',
        padding: scaleFont(10),
    },
    containerScrolled: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inlineRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchBarFull: {
        marginTop: scaleFont(10),
    },
});

export default Header;
