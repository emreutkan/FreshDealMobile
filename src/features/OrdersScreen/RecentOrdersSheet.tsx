import React, {useCallback, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/src/types/store';
import {AppDispatch} from '@/src/redux/store';
import {fetchActiveOrdersAsync} from '@/src/redux/thunks/purchaseThunks';
import {MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';
import {lightHaptic} from '@/src/utils/Haptics';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RecentOrdersSheet: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<NavigationProp>();
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ['10%', '50%'], []);

    const {activeOrders, loadingActiveOrders} = useSelector((state: RootState) => state.purchase);

    useEffect(() => {
        dispatch(fetchActiveOrdersAsync());
    }, [dispatch]);

    const handleSheetChanges = useCallback((index: number) => {
        if (index > 0) lightHaptic();
    }, []);

    const navigateToOrderDetails = (orderId: number) => {
        navigation.navigate('OrderDetails', {orderId});
    };

    const navigateToAllOrders = () => {
        navigation.navigate('Orders', {status: 'active'});
    };

    const renderOrderCard = (order: any) => (
        <TouchableOpacity
            key={order.purchase_id}
            style={styles.orderCard}
            onPress={() => navigateToOrderDetails(order.purchase_id)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderTitle}>{order.listing_title}</Text>
                <View style={[styles.statusBadge, {backgroundColor: getStatusColor(order.status).bg}]}>
                    <Text style={[styles.statusText, {color: getStatusColor(order.status).text}]}>
                        {order.status}
                    </Text>
                </View>
            </View>
            <View style={styles.orderInfo}>
                <MaterialIcons name="shopping-cart" size={16} color="#666"/>
                <Text style={styles.orderQuantity}>Quantity: {order.quantity}</Text>
            </View>
        </TouchableOpacity>
    );

    const getStatusColor = (status: string) => {
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

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backgroundStyle={styles.sheetContainer}
        >
            <BottomSheetView style={styles.contentContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Recent Orders</Text>
                        <TouchableOpacity onPress={navigateToAllOrders}>
                            <Text style={styles.viewAllText}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {loadingActiveOrders ? (
                        <ActivityIndicator color="#50703C" style={styles.loader}/>
                    ) : activeOrders.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="receipt-long" size={24} color="#666"/>
                            <Text style={styles.emptyText}>No recent orders</Text>
                        </View>
                    ) : (
                        <View style={styles.ordersContainer}>
                            {activeOrders.slice(0, 3).map(renderOrderCard)}
                        </View>
                    )}
                </View>
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        fontFamily: 'Poppins-Regular',
    },
    viewAllText: {
        fontSize: 14,
        color: '#50703C',
        fontWeight: '600',
        fontFamily: 'Poppins-Regular',
    },
    ordersContainer: {
        gap: 12,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
    },
    orderQuantity: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
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
    loader: {
        marginTop: 20,
    },
});

export default RecentOrdersSheet;