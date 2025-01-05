// Layout.tsx
import React from 'react';
import {useSelector} from "react-redux";
import {RootState} from "@/store/store";
import AddressSelectorScreen from "@/app/features/addressSelection/screens/addressSelectionScreen";
import {Slot} from "expo-router";


const Layout: React.FC = () => {
    const addresses = useSelector((state: RootState) => state.address.addresses);

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }

    return (
        <>
            <Slot></Slot>
        </>
    );
};


export default Layout;
