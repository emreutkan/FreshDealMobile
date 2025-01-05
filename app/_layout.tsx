import React from 'react';
import {Provider} from 'react-redux';
import {store} from "@/store/store";

import {Slot} from 'expo-router';
import {GestureHandlerRootView} from "react-native-gesture-handler";

const Layout = () => {
    return (
        <GestureHandlerRootView style={{borderWidth: 1, flex: 1}}>
            <Provider store={store}>
                <Slot/>
            </Provider>
        </GestureHandlerRootView>
    );
};

export default Layout;
