// components/AddressForm.tsx
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import InputField from "@/app/features/DefaultInput";
import DefaultButton from "@/app/features/DefaultButton";
import {scaleFont} from "@/app/utils/ResponsiveFont";


import {Address} from '@/store/userSlice';

interface AddressFormProps {
    address: Address;
    onChange: (field: keyof Address, value: string) => void;
    onConfirm: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({address, onChange, onConfirm}) => {
    return (
        <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Street</Text>
                <InputField
                    placeholder="Street name"
                    value={address.street}
                    onChange={(text) => onChange('street', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>District</Text>
                <InputField
                    placeholder="District"
                    value={address.district}
                    onChange={(text) => onChange('district', text)}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Postal Code</Text>
                <InputField
                    placeholder="Postal Code"
                    value={address.postalCode}
                    onChange={(text) => onChange('postalCode', text)}
                />
            </View>

            <View style={styles.additionalFields}>
                <InputField
                    placeholder="Title"
                    value={address.title}
                    onChange={(text) => onChange('title', text)}
                />
                <InputField
                    placeholder="Apt No"
                    value={address.apartmentNo}
                    onChange={(text) => onChange('apartmentNo', text)}
                />
                <InputField
                    placeholder="Door No"
                    value={address.doorNo}
                    onChange={(text) => onChange('doorNo', text)}
                />
            </View>

            <DefaultButton onPress={onConfirm} title="Confirm Address"/>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        borderWidth: 2,
        borderColor: '#b2f7a5',
        flex: 1,
        paddingHorizontal: scaleFont(16),
        gap: scaleFont(16),
    },
    inputGroup: {
        marginBottom: scaleFont(12),
    },
    label: {
        fontSize: scaleFont(14),
        fontWeight: '500',
        marginBottom: scaleFont(4),
    },
    additionalFields: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default AddressForm;
