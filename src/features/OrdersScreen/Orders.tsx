import React, {useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";

import {fetchActiveOrdersAsync, fetchPreviousOrdersAsync} from '@/src/redux/thunks/purchaseThunks';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from "@/src/utils/navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {MaterialIcons} from "@expo/vector-icons";
import {Purchase} from "@/src/types/api/purchase/model";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {lightHaptic} from "@/src/utils/Haptics";

type OrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type OrdersScreenRouteProp = RouteProp<RootStackParamList, 'Orders'>;

const OrderStatusBadge: React.FC<{ status: string }> = ({status}) => {
    const getStatusColor = () => {
        switch (status.toUpperCase()) {
            case 'PENDING':
                return {bg: '#FFF3CD', text: '#856404'};
            case 'ACCEPTED':
                return {bg: '#D4EDDA', text: '#155724'};
            case 'COMPLETED':
                return {bg: '#50703C', text: '#FFFFFF'};
            case 'REJECTED':
                return {bg: '#F8D7DA', text: '#721C24'};
            default:
                return {bg: '#E2E3E5', text: '#383D41'};
        }
    };

    const colors = getStatusColor();

    return (
        <View style={[styles.statusBadge, {backgroundColor: colors.bg}]}>
            <Text style={[styles.statusText, {color: colors.text}]}>
                {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </Text>
        </View>
    );
};

const OrderCard: React.FC<{ order: Purchase }> = ({order}) => {
    const navigation = useNavigation<OrdersScreenNavigationProp>();

    return (
        <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', {orderId: order.purchase_id})}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{order.listing_title}</Text>
                <OrderStatusBadge status={order.status}/>
            </View>
            <View style={styles.orderInfo}>
                <MaterialIcons name="shopping-cart" size={16} color="#666"/>
                <Text style={styles.orderQuantity}>Quantity: {order.quantity}</Text>
            </View>
            <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>
                    {new Date(order.purchase_date).toLocaleDateString()}
                </Text>
                <Text style={styles.orderPrice}>{order.total_price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const Orders: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const route = useRoute<OrdersScreenRouteProp>();
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const {
        activeOrders,
        previousOrders,
        loadingActiveOrders,
        loadingPreviousOrders,
        previousOrdersPagination
    } = useSelector((state: RootState) => state.purchase);

    const status = route.params?.status || 'active';

    useEffect(() => {
        lightHaptic().then(r => console.log(r));
        loadOrders().then(r => console.log(r));
    }, [status]);

    const loadOrders = async () => {
        if (status === 'active') {
            await dispatch(fetchActiveOrdersAsync());
        } else {
            await dispatch(fetchPreviousOrdersAsync({page: currentPage}));
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadOrders();
        setRefreshing(false);
    };

    const loadMorePreviousOrders = async () => {
        if (status === 'previous' &&
            previousOrdersPagination.hasNext &&
            !loadingPreviousOrders) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            await dispatch(fetchPreviousOrdersAsync({page: nextPage}));
        }
    };

    const renderOrder = ({item}: { item: Purchase }) => (
        <OrderCard order={item}/>
    );

    if (loadingActiveOrders || loadingPreviousOrders) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
            </View>
        );
    }

    return (
        <>
            <View style={[styles.header, {paddingTop: insets.top}]}>
                <GoBackIcon/>
                <Text style={styles.headerTitle}>
                    {status === 'active' ? 'Active Orders' : 'Previous Orders'}
                </Text>
                <View style={styles.headerRight}/>
            </View>
            <FlatList
                data={status === 'active' ? activeOrders : previousOrders}
                renderItem={renderOrder}
                keyExtractor={(item) => item.purchase_id.toString()} // Changed from item.id
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#50703C']}
                    />
                }
                onEndReached={status === 'previous' ? loadMorePreviousOrders : undefined}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="shopping-cart" size={48} color="#666"/>
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                )}
            />
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginLeft: -24, // Adjust for the back button
        fontFamily: 'Poppins-Regular',
    },
    headerRight: {
        width: 24, // Match the width of the back button for centering
    },
    listContainer: {
        padding: 16,
        backgroundColor: '#f8f9fa',
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
    orderInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    orderQuantity: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderDate: {
        color: '#666',
        fontSize: 14,
        fontFamily: 'Poppins-Regular',
    },
    orderPrice: {
        color: '#50703C',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        marginTop: 8,
        color: '#666',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
    },
});

export default Orders;