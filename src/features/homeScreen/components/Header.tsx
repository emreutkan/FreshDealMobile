import React from 'react';
import {StyleSheet, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import SearchBar from "@/src/features/homeScreen/components/SearchBar";
import AccountBar from "@/src/features/homeScreen/components/AccountBar";
import FavoritesBar from "@/src/features/homeScreen/components/FavoritesBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";

interface HeaderProps {
    isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({isScrolled}) => {
    return (

        <View style={styles.header}>
            {isScrolled ? (
                // Scrolled Layout: Inline components
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
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#b2f7a5',
        paddingBottom: scaleFont(10),
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
        // shadowColor: "#000",
        shadowOffset: {width: 0, height: 8}, // Offset downward to apply shadow only below
        shadowOpacity: 0.08, // Slightly stronger shadow
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        zIndex: 9999, // Ensures it is above other elements visually
    },
    container: {
        paddingHorizontal: 10,
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
});

export default Header;
