import React, {useEffect} from 'react';
import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '@/src/utils/navigation';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '@/src/redux/store';
import {RootState} from "@/src/types/store";

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {GoBackIcon} from "@/src/features/homeScreen/components/goBack";
import {MaterialIcons} from "@expo/vector-icons";
import {fetchOrderDetailsAsync} from "@/src/redux/thunks/purchaseThunks";

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;

const OrderDetails: React.FC = () => {

    const getDeliveryIcon = (isDelivery: boolean): MaterialIconName => {
        return isDelivery ? 'local-shipping' : 'store' as MaterialIconName;
    };
    const route = useRoute<OrderDetailsRouteProp>();
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const {orderId} = route.params;

    const {currentOrder, loadingCurrentOrder} = useSelector(
        (state: RootState) => state.purchase
    );

    useEffect(() => {
        dispatch(fetchOrderDetailsAsync(orderId));
    }, [orderId]);

    if (loadingCurrentOrder || !currentOrder) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#50703C"/>
            </View>
        );
    }

    const renderOrderStatus = () => {
        if (!currentOrder.completion_image_url && currentOrder.status !== 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="hourglass-empty" size={24} color="#FFA500"/>
                    <Text style={styles.statusText}>
                        Waiting for restaurant to prepare and upload the food image
                    </Text>
                </View>
            );
        } else if (!currentOrder.completion_image_url && currentOrder.status === 'COMPLETED') {
            return (
                <View style={styles.statusContainer}>
                    <MaterialIcons name="error" size={24} color="#FF0000"/>
                    <Text style={[styles.statusText, styles.errorText]}>
                        Backend Error: Completion image missing
                    </Text>
                </View>
            );
        }

        return (
            <Image
                source={{uri: currentOrder.completion_image_url}}
                style={styles.completionImage}
                defaultSource={require('@/src/assets/images/icon.png')}
            />
        );
    };

    if (loadingCurrentOrder || !currentOrder) {
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
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={styles.headerRight}/>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{currentOrder.listing_title}</Text>

                    <View style={styles.statusSection}>
                        <View style={styles.detailRow}>
                            <MaterialIcons name="flag" size={20} color="#666"/>
                            <Text style={[styles.detailText, styles.statusText,
                                {color: currentOrder.status === 'COMPLETED' ? '#4CAF50' : '#FFA500'}]}>
                                Status: {currentOrder.status}
                            </Text>
                        </View>
                        {renderOrderStatus()}
                    </View>

                    <View style={styles.infoSection}>
                        {currentOrder.restaurant && (
                            <View style={styles.detailRow}>
                                <MaterialIcons name="store" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    Restaurant: {currentOrder.restaurant.name}
                                </Text>
                            </View>
                        )}

                        <View style={styles.detailRow}>
                            <MaterialIcons name="receipt" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                Order ID: #{currentOrder.purchase_id}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="schedule" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                {new Date(currentOrder.purchase_date).toLocaleString()}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons name="shopping-cart" size={20} color="#666"/>
                            <Text style={styles.detailText}>
                                Quantity: {currentOrder.quantity}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <MaterialIcons
                                name={getDeliveryIcon(currentOrder.is_delivery)}
                                size={20}
                                color="#666"
                            />
                            <Text style={styles.detailText}>
                                {currentOrder.is_delivery ? "Delivery Order" : "Pickup Order"}
                            </Text>
                        </View>
                    </View>

                    {currentOrder.is_delivery && (
                        <View style={styles.deliverySection}>
                            <Text style={styles.sectionTitle}>Delivery Information</Text>
                            <View style={styles.detailRow}>
                                <MaterialIcons name="location-on" size={20} color="#666"/>
                                <Text style={styles.detailText}>
                                    {currentOrder.delivery_address}
                                </Text>
                            </View>
                            {currentOrder.delivery_notes && (
                                <View style={styles.detailRow}>
                                    <MaterialIcons name="note" size={20} color="#666"/>
                                    <Text style={styles.detailText}>
                                        {currentOrder.delivery_notes}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

                    <View style={styles.priceSection}>
                        <Text style={styles.totalPrice}>
                            Total: {currentOrder.total_price} TL
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    statusSection: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF8E1',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    statusText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    errorText: {
        color: '#FF0000',
    },
    completionImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginTop: 8,
    },
    infoSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        fontFamily: 'Poppins-Regular',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
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
        marginLeft: -24,
        fontFamily: 'Poppins-Regular',
    },
    headerRight: {
        width: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        margin: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
        fontFamily: 'Poppins-Regular',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#666',
        flex: 1,
        fontFamily: 'Poppins-Regular',
    },
    deliverySection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 12,
        paddingTop: 12,
    },
    priceSection: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        marginTop: 12,
        paddingTop: 12,
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '600',
        color: '#50703C',
        fontFamily: 'Poppins-Regular',
    },
});

export default OrderDetails;