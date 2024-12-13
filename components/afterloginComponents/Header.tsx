import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {scaleFont} from "@/components/utils/ResponsiveFont";
import AddressBar from "@/components/afterloginComponents/AddressBar";

const {height: screenHeight} = Dimensions.get('window');
const HEADER_HEIGHT = screenHeight * scaleFont(0.14);

const Header = ({visible = true,}) => {
    if (!visible) {
        return null; // If visible is false, do not render the header
    }

    return (
        <View style={styles.headerContainer}>
            <View style={styles.rowContainer}>
                {/* Left Section: AddressBar */}
                <View style={styles.leftContainer}>
                    <AddressBar/>
                </View>

                {/* Right Section: Notification and Profile Icons */}
                <View style={styles.rightContainer}>
                    {/*<NotificationIcon />*/}
                    {/*<ProfileIcon />*/}
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
        paddingHorizontal: scaleFont(15),
        paddingBottom: HEADER_HEIGHT / scaleFont(15),
        borderBottomRightRadius: scaleFont(15),
        borderBottomLeftRadius: scaleFont(15),
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    leftContainer: {
        width: scaleFont(100),
    },
    rightContainer: {
        borderWidth: 1,
        width: scaleFont(100),
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Header;
