// Header.tsx
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import AddressBar from "@/app/features/homeScreen/components/AddressBar";
import SearchBar from "@/app/features/homeScreen/components/SearchBar";
import {scaleFont} from "@/app/utils/ResponsiveFont";
import AccountBar from "@/app/features/homeScreen/components/AccountBar";
import FavoritesBar from "@/app/features/homeScreen/components/FavoritesBar";

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
