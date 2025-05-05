import React, {useEffect, useState} from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {AppDispatch} from '@/src/redux/store';
import {
    getListingsThunk,
    getRecentRestaurantsThunk,
    getRestaurantsByProximity
} from '@/src/redux/thunks/restaurantThunks';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {tokenService} from '@/src/services/tokenService';
import {getFavoritesThunk} from '@/src/redux/thunks/userThunks';
import {fetchCart} from '@/src/redux/thunks/cartThunks';

const {width} = Dimensions.get('window');

export const DebugMenu = ({visible, onClose}: { visible: boolean, onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const state = useSelector((state: RootState) => state);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const getToken = async () => {
            const t = await tokenService.getToken();
            setToken(t);
        };
        getToken();
    }, [visible]);

    const apiTests = [
        {
            title: "Restaurant APIs",
            data: [
                {
                    name: "Test Recent Restaurants",
                    action: async () => {
                        try {
                            const response = await dispatch(getRecentRestaurantsThunk()).unwrap();
                            Alert.alert('API Response', JSON.stringify(response, null, 2));
                        } catch (error) {
                            Alert.alert('API Error', JSON.stringify(error, null, 2));
                        }
                    }
                },
                {
                    name: "Test Restaurants By Proximity",
                    action: async () => {
                        try {
                            const response = await dispatch(getRestaurantsByProximity()).unwrap();
                            Alert.alert('API Response', JSON.stringify(response, null, 2));
                        } catch (error) {
                            Alert.alert('API Error', JSON.stringify(error, null, 2));
                        }
                    }
                },
                {
                    name: "Test Get Listings",
                    action: async () => {
                        try {
                            const restaurantId = state.restaurant.selectedRestaurant?.id;
                            if (!restaurantId) {
                                Alert.alert('Error', 'No restaurant selected');
                                return;
                            }
                            const response = await dispatch(getListingsThunk({restaurantId})).unwrap();
                            Alert.alert('API Response', JSON.stringify(response, null, 2));
                        } catch (error) {
                            Alert.alert('API Error', JSON.stringify(error, null, 2));
                        }
                    }
                }
            ]
        },
        {
            title: "User APIs",
            data: [
                {
                    name: "Test Get Favorites",
                    action: async () => {
                        try {
                            const response = await dispatch(getFavoritesThunk()).unwrap();
                            Alert.alert('API Response', JSON.stringify(response, null, 2));
                        } catch (error) {
                            Alert.alert('API Error', JSON.stringify(error, null, 2));
                        }
                    }
                }
            ]
        },
        {
            title: "Cart APIs",
            data: [
                {
                    name: "Test Get Cart",
                    action: async () => {
                        try {
                            const response = await dispatch(fetchCart()).unwrap();
                            Alert.alert('API Response', JSON.stringify(response, null, 2));
                        } catch (error) {
                            Alert.alert('API Error', JSON.stringify(error, null, 2));
                        }
                    }
                }
            ]
        }
    ];

    const renderStateSection = (title: string, data: any) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.sectionContent}>{JSON.stringify(data, null, 2)}</Text>
        </View>
    );

    const renderItem = ({item}: { item: { name: string, action: () => void } }) => (
        <TouchableOpacity
            style={styles.testButton}
            onPress={item.action}
        >
            <Text style={styles.testButtonText}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Debug Menu</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content}>
                    <View style={styles.apiSection}>
                        <Text style={styles.apiSectionTitle}>API Tests</Text>
                        <SectionList
                            sections={apiTests}
                            keyExtractor={(item, index) => item.name + index}
                            renderItem={renderItem}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={styles.sectionHeader}>{title}</Text>
                            )}
                            stickySectionHeadersEnabled={false}
                        />
                    </View>

                    <View style={styles.stateSection}>
                        <Text style={styles.apiSectionTitle}>State Information</Text>
                        {renderStateSection('User Token', token)}
                        {renderStateSection('User State', state.user)}
                        {renderStateSection('Restaurant State', state.restaurant)}
                        {renderStateSection('Cart State', state.cart)}
                        {renderStateSection('Address State', state.address)}
                        {renderStateSection('Search State', state.search)}
                        {renderStateSection('Purchase State', state.purchase)}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#50703C',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Poppins-SemiBold',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    apiSection: {
        marginBottom: 20,
    },
    stateSection: {
        marginTop: 20,
    },
    apiSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
        fontFamily: 'Poppins-SemiBold',
    },
    section: {
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 12,
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    sectionContent: {
        color: '#fff',
        fontFamily: 'Poppins-Regular',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#50703C',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        marginVertical: 8,
        borderRadius: 4,
        fontFamily: 'Poppins-SemiBold',
    },
    testButton: {
        backgroundColor: '#50703C',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        marginHorizontal: 8,
    },
    testButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
    },
});