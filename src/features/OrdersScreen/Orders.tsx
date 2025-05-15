import React, {useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";
import {fetchActiveOrdersAsync, fetchPreviousOrdersAsync} from '@/src/redux/thunks/purchaseThunks';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from "@/src/utils/navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {Ionicons} from "@expo/vector-icons";
import {Purchase} from "@/src/types/api/purchase/model";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {lightHaptic} from "@/src/utils/Haptics";
import {LinearGradient} from "expo-linear-gradient";

const {width} = Dimensions.get('window');

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type OrdersScreenRouteProp = RouteProp<RootStackParamList, 'Orders'>;

export const OrderStatusBadge: React.FC<{ status: string }> = ({status}) => {
    const getStatusColor = () => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return {
                    bg: '#FFF3CD',
                    text: '#856404',
                    icon: 'time-outline',
                    label: 'Pending'
                };
            case 'ACCEPTED':
                return {
                    bg: '#D4EDDA',
                    text: '#155724',
                    icon: 'checkmark-circle-outline',
                    label: 'Accepted'
                };
            case 'COMPLETED':
                return {
                    bg: '#50703C',
                    text: '#FFFFFF',
                    icon: 'checkmark-done-circle-outline',
                    label: 'Completed'
                };
            case 'REJECTED':
                return {
                    bg: '#F8D7DA',
                    text: '#721C24',
                    icon: 'close-circle-outline',
                    label: 'Rejected'
                };
            default:
                return {
                    bg: '#E2E3E5',
                    text: '#383D41',
                    icon: 'help-circle-outline',
                    label: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
                };
        }
    };

    const statusInfo = getStatusColor();

    return (
        <View style={[styles.statusBadge, {backgroundColor: statusInfo.bg}]}>
            <Ionicons name={statusInfo.icon} size={12} color={statusInfo.text} style={{marginRight: 4}}/>
            <Text style={[styles.statusText, {color: statusInfo.text}]}>
                {statusInfo.label}
            </Text>
        </View>
    );
};

const OrderCard: React.FC<{ order: Purchase; index: number }> = ({order, index}) => {
    const navigation = useNavigation<OrdersScreenNavigationProp>();
    const translateY = useState(new Animated.Value(50))[0];
    const opacity = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                delay: index * 100,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const formattedDate = new Date(order.purchase_date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const formattedPrice = `${order.total_price}₺`;

    return (
        <Animated.View
            style={[
                styles.orderCardContainer,
                {
                    transform: [{translateY}],
                    opacity,
                }
            ]}
        >
            <TouchableOpacity
                style={styles.orderCard}
                onPress={() => navigation.navigate('OrderDetails', {orderId: order.purchase_id})}
                activeOpacity={0.9}
            >
                <View style={styles.orderTopSection}>
                    <View style={styles.orderHeader}>
                        <Text style={styles.orderTitle} numberOfLines={1}>{order.listing_title}</Text>
                        <OrderStatusBadge status={order.status}/>
                    </View>

                    <View style={styles.orderInfo}>
                        <View style={styles.orderInfoItem}>
                            <Ionicons name="restaurant-outline" size={16} color="#666666"/>
                            <Text style={styles.orderInfoText}>{order.restaurant_name || 'Restaurant'}</Text>
                        </View>

                        <View style={styles.orderInfoItem}>
                            <Ionicons name="cart-outline" size={16} color="#666666"/>
                            <Text style={styles.orderInfoText}>Quantity: {order.quantity}</Text>
                        </View>
                    </View>
                </View>

                <LinearGradient
                    colors={['#f8f8f8', '#ffffff']}
                    style={styles.divider}
                />

                <View style={styles.orderFooter}>
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={14} color="#666666"/>
                        <Text style={styles.orderDate}>{formattedDate}</Text>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.orderPrice}>{formattedPrice}</Text>
                        <Ionicons name="chevron-forward" size={16} color="#50703C"/>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

const TabButton: React.FC<{
    title: string;
    active: boolean;
    onPress: () => void;
}> = ({title, active, onPress}) => (
    <TouchableOpacity
        style={[styles.tabButton, active && styles.activeTabButton]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <Text style={[styles.tabButtonText, active && styles.activeTabButtonText]}>
            {title}
        </Text>
        {active && <View style={styles.tabIndicator}/>}
    </TouchableOpacity>
);

const Orders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<OrdersScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<OrdersScreenNavigationProp>();
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeTab, setActiveTab] = useState(route.params?.status || 'active');

    const {
        activeOrders,
        previousOrders,
        loadingActiveOrders,
        loadingPreviousOrders,
        previousOrdersPagination
    } = useSelector((state: RootState) => state.purchase);

    useEffect(() => {
        lightHaptic();
        loadOrders();
    }, [activeTab]);

    const loadOrders = async () => {
        if (activeTab === 'active') {
            await dispatch(fetchActiveOrdersAsync());
        } else {
            setCurrentPage(1);
            await dispatch(fetchPreviousOrdersAsync({page: 1}));
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const loadMorePreviousOrders = async () => {
        if (activeTab === 'previous' &&
            previousOrdersPagination.hasNext &&
            !loadingPreviousOrders) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            await dispatch(fetchPreviousOrdersAsync({page: nextPage}));
        }
    };

    const switchTab = (tab: string) => {
        setActiveTab(tab);
    };

    const renderOrder = ({item, index}: { item: Purchase; index: number }) => (
        <OrderCard order={item} index={index}/>
    );

    const renderEmptyState = () => {
        return (
            <View style={styles.emptyContainer}>
                {/*<Image*/}
                {/*    source={require('@/assets/images/empty-cart.png')}*/}
                {/*    style={styles.emptyImage}*/}
                {/*    resizeMode="contain"*/}
                {/*/>*/}
                <Text style={styles.emptyTitle}>
                    {activeTab === 'active' ? 'No Active Orders' : 'No Previous Orders'}
                </Text>
                <Text style={styles.emptyText}>
                    {activeTab === 'active'
                        ? "You don't have any active orders at the moment"
                        : "You haven't completed any orders yet"}
                </Text>
                <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.emptyButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderListFooter = () => {
        if (activeTab === 'previous' && loadingPreviousOrders && previousOrders.length > 0) {
            return (
                <View style={styles.footerLoader}>
                    <ActivityIndicator size="small" color="#50703C"/>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, {paddingTop: insets.top + 10}]}>
                <View style={styles.headerTopRow}>
                    <GoBackIcon/>
                    <Text style={styles.headerTitle}>My Orders</Text>
                    <View style={styles.headerRight}/>
                </View>

                <View style={styles.tabContainer}>
                    <TabButton
                        title="Active"
                        active={activeTab === 'active'}
                        onPress={() => switchTab('active')}
                    />
                    <TabButton
                        title="Previous"
                        active={activeTab === 'previous'}
                        onPress={() => switchTab('previous')}
                    />
                </View>
            </View>

            {(loadingActiveOrders && activeTab === 'active') ||
            (loadingPreviousOrders && activeTab === 'previous' && previousOrders.length === 0) ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#50703C"/>
                    <Text style={styles.loadingText}>Loading orders...</Text>
                </View>
            ) : (
                <FlatList
                    data={activeTab === 'active' ? activeOrders : previousOrders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.purchase_id.toString()}
                    contentContainerStyle={[
                        styles.listContainer,
                        (activeTab === 'active' && activeOrders.length === 0) ||
                        (activeTab === 'previous' && previousOrders.length === 0)
                            ? styles.emptyListContainer : null
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={['#50703C']}
                            tintColor="#50703C"
                        />
                    }
                    onEndReached={activeTab === 'previous' ? loadMorePreviousOrders : undefined}
                    onEndReachedThreshold={0.5}
                    ListEmptyComponent={renderEmptyState}
                    ListFooterComponent={renderListFooter}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        zIndex: 10,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 22,
        color: '#333',
        marginLeft: -24,
        fontFamily: 'Poppins-SemiBold',
    },
    headerRight: {
        width: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 5,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        position: 'relative',
    },
    activeTabButton: {
        backgroundColor: 'transparent',
    },
    tabButtonText: {
        fontSize: 15,
        color: '#999',
        fontFamily: 'Poppins-Regular',
    },
    activeTabButtonText: {
        color: '#50703C',
        fontFamily: 'Poppins-SemiBold',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: 40,
        backgroundColor: '#50703C',
        borderRadius: 2,
    },
    listContainer: {
        padding: 16,
        paddingTop: 8,
    },
    emptyListContainer: {
        flexGrow: 1,
    },
    orderCardContainer: {
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    orderTopSection: {
        padding: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    orderTitle: {
        fontSize: 16,
        color: '#333',
        flex: 1,
        fontFamily: 'Poppins-SemiBold',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 11,
        fontFamily: 'Poppins-Medium',
    },
    orderInfo: {
        marginTop: 5,
    },
    orderInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 3,
    },
    orderInfoText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    divider: {
        height: 1,
        width: '100%',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderDate: {
        marginLeft: 6,
        color: '#666',
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderPrice: {
        color: '#50703C',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-SemiBold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyImage: {
        width: width * 0.5,
        height: width * 0.5,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Poppins-SemiBold',
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
        fontFamily: 'Poppins-Regular',
    },
    emptyButton: {
        backgroundColor: '#50703C',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    emptyButtonText: {
        color: '#FFF',
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
    },
    footerLoader: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default Orders;