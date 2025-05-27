import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    SectionList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {AppDispatch} from '@/src/redux/store';
import {
    getListingsThunk,
    getRecentRestaurantsThunk,
    getRestaurantsByProximity
} from '@/src/redux/thunks/restaurantThunks';
import {tokenService} from '@/src/services/tokenService';
import {getFavoritesThunk} from '@/src/redux/thunks/userThunks';
import {fetchCart} from '@/src/redux/thunks/cartThunks';
import {getRecommendationsThunk} from '@/src/redux/thunks/recommendationThunks';

const DebugMenuScreen: React.FC = () => {

    const [showingReduxState, setShowingReduxState] = useState(false);
    const [testingApi, setTestingApi] = useState(false);
    const [apiTestResults, setApiTestResults] = useState<any>(null);
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    // Get the entire Redux state
    const state = useSelector((state: RootState) => state);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const getToken = async () => {
            const t = await tokenService.getToken();
            setToken(t);
        };
        getToken();
    }, []);

    const apiTests = [
        {
            title: "Restaurant APIs",
            data: [
                {
                    name: "Test Recent Restaurants",
                    action: async () => {
                        try {
                            setTestingApi(true);
                            setSelectedEndpoint("Recent Restaurants");
                            const response = await dispatch(getRecentRestaurantsThunk()).unwrap();
                            setApiTestResults(response);
                        } catch (error) {
                            setApiTestResults({error: JSON.stringify(error)});
                        } finally {
                            setTestingApi(false);
                        }
                    }
                },
                {
                    name: "Test Restaurants By Proximity",
                    action: async () => {
                        try {
                            setTestingApi(true);
                            setSelectedEndpoint("Restaurants By Proximity");
                            const response = await dispatch(getRestaurantsByProximity()).unwrap();
                            setApiTestResults(response);
                        } catch (error) {
                            setApiTestResults({error: JSON.stringify(error)});
                        } finally {
                            setTestingApi(false);
                        }
                    }
                },
                {
                    name: "Test Get Listings",
                    action: async () => {
                        try {
                            setTestingApi(true);
                            setSelectedEndpoint("Get Listings");

                            const restaurantId = state.restaurant.selectedRestaurant?.id;
                            if (!restaurantId) {
                                setApiTestResults({error: "No restaurant selected"});
                                setTestingApi(false);
                                return;
                            }

                            const response = await dispatch(getListingsThunk({restaurantId})).unwrap();
                            setApiTestResults(response);
                        } catch (error) {
                            setApiTestResults({error: JSON.stringify(error)});
                        } finally {
                            setTestingApi(false);
                        }
                    }
                }
            ]
        },
        {
            title: "Recommendations API",
            data: [
                {
                    name: "Test Recommended Restaurants",
                    action: async () => {
                        try {
                            setTestingApi(true);
                            setSelectedEndpoint("Recommended Restaurants");
                            const response = await dispatch(getRecommendationsThunk()).unwrap();
                            // Include both API response and current Redux state
                            setApiTestResults({
                                apiResponse: response,
                                reduxState: state.recommendation
                            });
                        } catch (error) {
                            setApiTestResults({
                                error: JSON.stringify(error),
                                reduxState: state.recommendation
                            });
                        } finally {
                            setTestingApi(false);
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
                            setTestingApi(true);
                            setSelectedEndpoint("Get Favorites");
                            const response = await dispatch(getFavoritesThunk()).unwrap();
                            setApiTestResults(response);
                        } catch (error) {
                            setApiTestResults({error: JSON.stringify(error)});
                        } finally {
                            setTestingApi(false);
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
                            setTestingApi(true);
                            setSelectedEndpoint("Get Cart");
                            const response = await dispatch(fetchCart()).unwrap();
                            setApiTestResults(response);
                        } catch (error) {
                            setApiTestResults({error: JSON.stringify(error)});
                        } finally {
                            setTestingApi(false);
                        }
                    }
                }
            ]
        }
    ];

    const clearCache = () => {
        console.log(`[DEBUG][${currentDate}][${currentUser}] Clearing application cache...`);
        Alert.alert('Cache Cleared', 'Application cache has been cleared successfully.');
    };

    const resetReduxState = () => {
        console.log(`[DEBUG][${currentDate}][${currentUser}] Resetting Redux state...`);
        dispatch({type: 'RESET_REDUX_STATE'});
        Alert.alert('Redux Reset', 'Redux state has been reset to initial values.');
    };


    const renderStateSection = (title: string, data: any) => (
        <View style={styles.stateSection}>
            <Text style={styles.stateSectionTitle}>{title}</Text>
            <ScrollView style={styles.jsonContainer}>
                <Text style={styles.codeText}>{JSON.stringify(data, null, 2)}</Text>
            </ScrollView>
        </View>
    );

    const renderItem = ({item}: { item: { name: string, action: () => void } }) => (
        <TouchableOpacity
            style={styles.testButton}
            onPress={item.action}
            disabled={testingApi}
        >
            <Text style={styles.testButtonText}>{item.name}</Text>
            {testingApi && selectedEndpoint === item.name ? (
                <ActivityIndicator size="small" color="#FFFFFF" style={styles.testLoader}/>
            ) : null}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Debug Menu</Text>
                <Text style={styles.versionText}>v1.0.0 (build 42)</Text>
            </View>

            <ScrollView style={styles.container}>
                {/* System Information Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle-outline" size={20} color="#4285F4"/>
                        <Text style={styles.sectionTitle}>System Information</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>User:</Text>
                        <Text style={styles.infoValue}>{currentUser}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>{currentDate}</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Platform:</Text>
                        <Text style={styles.infoValue}>React Native</Text>
                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Token:</Text>
                        <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                            {token || 'Not available'}
                        </Text>
                    </View>
                </View>

                {/* Debug Tools Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="code-working-outline" size={20} color="#4285F4"/>
                        <Text style={styles.sectionTitle}>Debug Tools</Text>
                    </View>

                    <TouchableOpacity style={styles.optionItem} onPress={clearCache}>
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="refresh-outline" size={22} color="#4285F4"/>
                        </View>
                        <Text style={styles.optionText}>Clear Cache</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CCCCCC"/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionItem}
                        onPress={() => setShowingReduxState(!showingReduxState)}
                    >
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="cube-outline" size={22} color="#4285F4"/>
                        </View>
                        <Text style={styles.optionText}>Inspect Redux State</Text>
                        <Ionicons
                            name={showingReduxState ? "chevron-down" : "chevron-forward"}
                            size={20}
                            color="#CCCCCC"
                        />
                    </TouchableOpacity>

                    {showingReduxState && (
                        <View style={styles.stateContainer}>
                            {renderStateSection('User State', state.user)}
                            {renderStateSection('Restaurant State', state.restaurant)}
                            {renderStateSection('Cart State', state.cart)}
                            {renderStateSection('Address State', state.address)}
                            {renderStateSection('Search State', state.search)}
                            {renderStateSection('Purchase State', state.purchase)}

                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetReduxState}
                            >
                                <Text style={styles.resetButtonText}>Reset Redux State</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.optionItem}>
                        <View style={styles.optionIconContainer}>
                            <Ionicons name="flask-outline" size={22} color="#4285F4"/>
                        </View>
                        <Text style={styles.optionText}>Environment</Text>
                        <Switch
                            trackColor={{false: "#767577", true: "#81b0ff"}}
                            thumbColor={"#f4f3f4"}
                            onValueChange={toggleEnvironment}
                            value={false} // Get this from Redux
                        />
                    </View>
                </View>

                {/* API Testing Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="server-outline" size={20} color="#4285F4"/>
                        <Text style={styles.sectionTitle}>API Testing</Text>
                    </View>

                    <SectionList
                        sections={apiTests}
                        keyExtractor={(item, index) => item.name + index}
                        renderItem={renderItem}
                        renderSectionHeader={({section: {title}}) => (
                            <Text style={styles.apiSectionHeader}>{title}</Text>
                        )}
                        stickySectionHeadersEnabled={false}
                    />

                    {apiTestResults && (
                        <View style={styles.apiResultContainer}>
                            <Text style={styles.apiResultTitle}>API Test Results</Text>
                            <ScrollView style={styles.jsonContainer}>
                                <Text style={styles.codeText}>
                                    {JSON.stringify(apiTestResults, null, 2)}
                                </Text>
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F8F3'
    },
    header: {
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Poppins-SemiBold',
        color: '#333333'
    },
    versionText: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#888888',
        marginTop: 4
    },
    container: {
        flex: 1,
        padding: 16
    },
    section: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        marginLeft: 8,
        color: '#333'
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    optionIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        backgroundColor: 'rgba(66, 133, 244, 0.1)'
    },
    optionText: {
        flex: 1,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: '#333'
    },
    infoItem: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0'
    },
    infoLabel: {
        width: 100,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: '#666'
    },
    infoValue: {
        flex: 1,
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#333'
    },
    stateContainer: {
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        padding: 12,
        marginVertical: 8
    },
    jsonContainer: {
        maxHeight: 200,
        backgroundColor: '#2b2b2b',
        borderRadius: 4,
        padding: 8
    },
    codeText: {
        fontFamily: 'monospace',
        fontSize: 12,
        color: '#ffffff'
    },
    resetButton: {
        backgroundColor: '#4285F4',
        borderRadius: 4,
        padding: 8,
        alignItems: 'center',
        marginTop: 8
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontFamily: 'Poppins-Medium',
        fontSize: 14
    },
    apiResultContainer: {
        backgroundColor: '#f7f7f7',
        borderRadius: 8,
        padding: 12,
        marginTop: 8
    },
    apiResultTitle: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: '#333',
        marginBottom: 8
    },
    apiSectionHeader: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: '#50703C',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        marginVertical: 8,
        borderRadius: 4,
    },
    testButton: {
        backgroundColor: '#50703C',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    testButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    testLoader: {
        marginLeft: 10,
    },
    stateSection: {
        marginBottom: 12,
    },
    stateSectionTitle: {
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#333',
        marginBottom: 4,
    }
});

export default DebugMenuScreen;
