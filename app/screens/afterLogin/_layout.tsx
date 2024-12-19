import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import AddressSelectorScreen from "@/app/screens/addressScreen/addressSelectionScreen";
import AfterLoginScreen from "@/app/screens/afterLogin/afterlogin";
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Header from "@/components/afterloginComponents/Header";

const Layout = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses);
    const [selectedTab, setSelectedTab] = useState<'Restaurants' | 'Market'>('Restaurants');
    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > 50); // Set to true when scrolled more than 10 pixels
    };
    const [isScrolled, setIsScrolled] = useState(false);

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }


    const renderContent = () => {
        switch (selectedTab) {
            case 'Restaurants':
                return (
                    <View style={styles.screen}>

                        <Header isScrolled={isScrolled}/>


                        <ScrollView
                            onScroll={handleScroll}
                            scrollEventThrottle={16} // For smooth performance
                        >
                            <AfterLoginScreen/>
                        </ScrollView>
                    </View>
                );
            case 'Market':
                return (
                    <View style={styles.screen}>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <View style={styles.container}>{renderContent()}</View>

            <SafeAreaView style={styles.navbar}>
                <TouchableOpacity
                    style={[styles.navItem, selectedTab === 'Restaurants' && styles.selectedItem]}
                    onPress={() => setSelectedTab('Restaurants')}
                >
                    <Text>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.navItem, selectedTab === 'Market' && styles.selectedItem]}
                    onPress={() => setSelectedTab('Market')}
                >
                    <Text>Market</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',

    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
    },
    navItem: {
        padding: 10,
        alignItems: 'center',

    },
    selectedItem: {
        borderBottomWidth: 2,

    },
    screen: {
        flex: 1,

    },


    text: {
        fontSize: 20,
        fontWeight: 'bold',

    },


});

export default Layout;
