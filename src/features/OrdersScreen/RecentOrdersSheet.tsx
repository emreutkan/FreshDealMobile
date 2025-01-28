import {StyleSheet} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '@/src/utils/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


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

