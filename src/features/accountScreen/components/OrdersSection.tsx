import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';

interface OrdersSectionProps {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({navigation}) => {
    return (
        <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>Orders</Text>
            <TouchableOpacity
                style={[styles.actionButton, styles.activeOrderButton]}
                onPress={() => navigation.navigate('Orders', {status: 'active'})}
            >
                <MaterialIcons name="pending-actions" size={24} color="#50703C"/>
                <Text style={styles.actionButtonText}>Active Orders</Text>
                <MaterialIcons name="chevron-right" size={24} color="#666"/>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Orders', {status: 'previous'})}
            >
                <MaterialIcons name="history" size={24} color="#50703C"/>
                <Text style={styles.actionButtonText}>Previous Orders</Text>
                <MaterialIcons name="chevron-right" size={24} color="#666"/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    orderSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        paddingLeft: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    activeOrderButton: {
        borderColor: '#50703C',
        borderWidth: 1,
    },
    actionButtonText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
        fontWeight: '500',
        fontFamily: 'Poppins-Regular',
    },
});

export default OrdersSection;
