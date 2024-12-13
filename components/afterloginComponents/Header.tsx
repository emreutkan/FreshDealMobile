// Header.tsx
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import AddressBar from "@/components/afterloginComponents/AddressBar";

const {height: screenHeight} = Dimensions.get('window');
const HEADER_HEIGHT = screenHeight * 0.14; // Adjusted to a direct proportion for clarity

const Header = () => {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.rowContainer}>
                {/* Left Section: AddressBar */}
                <View style={styles.leftContainer}>
                    <AddressBar/>
                    
                </View>

                {/* Right Section: Notification and Profile Icons */}
                <View style={styles.rightContainer}>

                    {/* Uncomment and add your icons here */}
                    {/* <NotificationIcon /> */}
                    {/* <ProfileIcon /> */}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: HEADER_HEIGHT,
        backgroundColor: '#ffffff',
        justifyContent: 'flex-end',
        paddingHorizontal: scaleFont(20),
        paddingBottom: scaleFont(10),
        borderBottomRightRadius: scaleFont(20),
        borderBottomLeftRadius: scaleFont(20),
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    leftContainer: {
        flex: 1, // Allows the AddressBar to take up available space
        marginRight: scaleFont(10),
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});

export default Header;
