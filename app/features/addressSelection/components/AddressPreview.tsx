import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import DefaultButton from "@/app/features/DefaultButton";
import {scaleFont} from "@/app/utils/ResponsiveFont";
import {Address} from '@/store/userSlice';

interface AddressPreviewProps {
    address: Address;
    onSelect: () => void;
    isLoading: boolean;
}

const AddressPreview: React.FC<AddressPreviewProps> = ({address, onSelect, isLoading}) => {
    return (
        <View style={styles.container}>
            <View style={styles.addressContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.addressText}>
                        {`${address.street}, ${address.district} ${address.postalCode}`}
                    </Text>
                    <Text style={styles.addressSubText}>
                        {`${address.province}, ${address.country}`}
                    </Text>
                </View>
                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="small" color="#0000ff"/>
                        <Text style={styles.loadingText}>Fetching address...</Text>
                    </View>
                )}
                <View style={styles.button}>
                    <DefaultButton onPress={onSelect} title="Select"/>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: scaleFont(8),

    },
    addressContainer: {
        marginHorizontal: scaleFont(16),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 0.5,
        marginRight: scaleFont(8), // Add spacing between text and button
    },
    addressText: {
        fontSize: scaleFont(16),
        fontWeight: 'bold',
    },
    addressSubText: {
        color: 'gray',
        fontWeight: '300',
        fontSize: scaleFont(12),
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(136,136,136,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 8,
    },
    loadingText: {
        marginTop: 5,
        fontSize: 14,
    },
    button: {
        flex: 0.5,

    },
});

export default AddressPreview;
