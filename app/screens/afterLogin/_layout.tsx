import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import AddressSelectionScreen from "@/app/screens/afterLogin/addressSelectionScreen";
import {Platform, StyleSheet} from "react-native";
import {scaleFont} from "@/components/utils/ResponsiveFont";
import Header from "@/components/afterloginComponents/Header";

const Layout = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses);
    const [headerVisible, setHeaderVisible] = useState(addresses && addresses.length > 0);

    // Function to hide the header when adding a new address
    const hideHeader = () => {
        setHeaderVisible(false);
    };

    const showHeader = () => {
        setHeaderVisible(true);
    };

    return (
        <>

            <Header/>
            {/* Pass hideHeader function to the AddressBar */}
            {/*<Slot/>*/}

            <AddressSelectionScreen onDone={showHeader}/>

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
    },
    main: {
        overflow: 'hidden',
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: scaleFont(25),
        borderTopRightRadius: scaleFont(25),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: -3},
                shadowOpacity: 0.1,
                shadowRadius: 5,
            },
            android: {
                elevation: 10,
            },
        }),
    },
});

export default Layout;
