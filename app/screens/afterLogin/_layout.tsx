import React, {useState} from 'react';
// import Header from "@/components/afterloginComponents/Header";
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store';
import AddressSelectorScreen from "@/app/screens/addressScreen/addressSelectionScreen";
import AfterLoginScreen from "@/app/screens/afterLogin/afterlogin";
import {Dimensions, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AccountScreen from "@/app/screens/tabs/account/accountScreen";
import {scaleFont} from "@/components/utils/ResponsiveFont";
import AddressBar from "@/components/afterloginComponents/AddressBar";
// import RestaurantSearch from "@/components/afterloginComponents/RestaurantSearch";

const {height: screenHeight} = Dimensions.get('window');
const HEADER_HEIGHT = screenHeight * 0.14; // Adjusted to a direct proportion for clarity


const Layout = () => {

    const RestaurantSearch = () => {
        return (
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Search for restaurants..."
                    placeholderTextColor="#999"
                />
            </View>
        );
    };

    const addresses = useSelector((state: RootState) => state.user.addresses);

    const [selectedTab, setSelectedTab] = useState<'Restaurants' | 'Market'>('Restaurants');

    if (!addresses || addresses.length === 0) {
        return <AddressSelectorScreen/>;
    }


    const Header = () => {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.headerContainer}>
                    <View style={styles.rowContainer}>
                        {/* Left Section: AddressBar and RestaurantSearch */}
                        <View style={styles.leftContainer}>
                            <AddressBar/>
                            <RestaurantSearch/>
                        </View>

                        {/* Right Section: Notification and Profile Icons */}
                        <View style={styles.rightContainer}>
                            {/* Uncomment and add your icons here */}
                            {/* <NotificationIcon /> */}
                            {/* <ProfileIcon /> */}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        );
    };

    const renderContent = () => {
        switch (selectedTab) {
            case 'Restaurants':
                return (
                    <View style={styles.screen}>
                        <Header/>
                        <AfterLoginScreen/>
                    </View>

                );

            case 'Market':
                return (
                    <View style={styles.screen}>
                        <AccountScreen></AccountScreen>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>

            <View style={styles.container}>
                {renderContent()}
            </View>

            <View style={styles.navbar}>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'Restaurants' && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedTab('Restaurants')}
                >
                    <Text>Restaurants</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.navItem,
                        selectedTab === 'Market' && styles.selectedItem,
                    ]}
                    onPress={() => setSelectedTab('Market')}
                >
                    <Text>Market</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#ffffff',
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    navItem: {
        padding: 10,
        alignItems: 'center',
    },
    selectedItem: {
        borderBottomWidth: 2,
        borderColor: '#50703C',
    },
    screen: {
        flex: 1,

    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerContainer: {
        height: HEADER_HEIGHT,
        // backgroundColor: '#ffffff',
        borderWidth: scaleFont(1),
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
    searchBarContainer: {
        marginTop: scaleFont(10),
    },
    searchBar: {
        backgroundColor: '#f2f2f2',
        borderRadius: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        paddingVertical: scaleFont(8),
        fontSize: scaleFont(14),
        color: '#333',
    },
});

export default Layout;
