import {StyleSheet} from 'react-native';
import {scaleFont} from '@/src/utils/ResponsiveFont';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: scaleFont(20),
        backgroundColor: '#fff',
    },
    title: {
        fontSize: scaleFont(20),
        fontWeight: '600',
        marginBottom: scaleFont(15),
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: scaleFont(8),
        padding: scaleFont(10),
        fontSize: scaleFont(16),
        marginBottom: scaleFont(15),
        backgroundColor: '#f9f9f9',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: scaleFont(12),
        borderRadius: scaleFont(8),
        marginHorizontal: scaleFont(5),
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: scaleFont(16),
        fontWeight: '600',
    },
});


