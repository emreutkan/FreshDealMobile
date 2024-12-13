import React from 'react';
import {Slot} from 'expo-router';
import {useSelector} from 'react-redux'; // Import for accessing Redux state
import {RootState} from '@/store/store';
import AddressSelectionScreen from "@/app/screens/afterLogin/addressSelectionScreen";
import {Platform, StyleSheet} from "react-native";
import {scaleFont} from "@/components/utils/ResponsiveFont"; // Adjust path as needed
import Header from "@/components/afterloginComponents/Header";

const Layout = () => {
    // Access user addresses from the Redux state
    const addresses = useSelector((state: RootState) => state.user.addresses);

    return (
        <>
            {addresses && addresses.length > 0 ? (
                <>
                    <Header/>
                    <Slot/>
                </>
            ) : (
                <>
                    <AddressSelectionScreen/>
                    {/*<AfterLoginScreen/>*/}
                </>

            )}
        </>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: scaleFont(150),
        height: scaleFont(150),
        marginTop: scaleFont(60),
        // marginBottom: scaleFont(0),
    },
    main: {
        overflow: 'hidden',
        flex: 1, // Fill available space
        width: '100%', // Full width
        backgroundColor: '#FFFFFF', // White background
        borderTopLeftRadius: scaleFont(25), // Rounded top-left corner
        borderTopRightRadius: scaleFont(25), // Rounded top-right corner
        // Platform-specific shadow styles
        ...Platform.select({
            ios: {
                shadowColor: '#000', // Shadow color for iOS
                shadowOffset: {width: 0, height: -3}, // Shadow offset for iOS
                shadowOpacity: 0.1, // Shadow opacity for iOS
                shadowRadius: 5, // Shadow radius for iOS
            },
            android: {
                elevation: 10, // Elevation for Android shadows
            },
        }),
    },
});


export default Layout;
