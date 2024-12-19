// Header.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import AddressBar from "@/components/afterloginComponents/AddressBar";
import SearchBar from "@/components/afterloginComponents/SearchBar";
import {scaleFont} from "@/components/utils/ResponsiveFont";
import AccountBar from "@/components/afterloginComponents/AccountBar";
import FavoritesBar from "@/components/afterloginComponents/FavoritesBar";

interface HeaderProps {
    isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({isScrolled}) => {
    return (
        <SafeAreaView style={styles.header}>
            {isScrolled ? (
                // Scrolled Layout: All components inline
                <View style={[styles.container, styles.containerScrolled]}>
                    <AddressBar/>
                    <View style={styles.inlineRightSection}>
                        <FavoritesBar/>
                        <AccountBar/>
                        <SearchBar isScrolled={isScrolled}/>
                    </View>
                </View>
            ) : (
                // Default Layout: Stacked SearchBar
                <View style={styles.container}>
                    <View style={styles.row}>
                        <AddressBar/>
                        <View style={styles.inlineRightSection}>
                            <FavoritesBar/>
                            <AccountBar/>
                        </View>
                    </View>
                    <SearchBar isScrolled={isScrolled}/>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        marginTop: scaleFont(-10), // Moves the header upwards

        backgroundColor: "#fff",
    },
    container: {
        // width: '100%',
        paddingHorizontal: scaleFont(10),
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
