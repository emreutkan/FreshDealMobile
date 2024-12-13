import React from 'react';
import Header from "@/components/afterloginComponents/Header";
import {useSelector} from 'react-redux'; // Import for accessing Redux state
import {RootState} from '@/store/store'; // Adjust path as needed
import AddressSelectorScreen from "@/app/screens/addressScreen/addressSelectionScreen"; // Import your address selection screen

const Layout = () => {
    // Access user addresses from the Redux state
    const addresses = useSelector((state: RootState) => state.user.addresses);

    return (
        <>
            {addresses && addresses.length > 0 ? (
                <>
                    <Header/>
                    {/*<Slot/>*/}
                </>
            ) : (
                <AddressSelectorScreen/>
            )}
        </>
    );
};

export default Layout;
