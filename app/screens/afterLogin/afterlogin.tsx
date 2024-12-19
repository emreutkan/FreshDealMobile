import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '@/store/store'; // Adjust the path to your store type

const AfterLoginScreen = () => {
    const addresses = useSelector((state: RootState) => state.user.addresses);


    return (
        <>
            <View style={styles.container}>
                {!addresses.length ? (
                    <View>
                        <Text>No address found. Please select your address.</Text>
                    </View>
                ) : (
                    <>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>
                        <Text>Welcome back! Your address is already set.</Text>

                    </>


                )}
            </View>
        </>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    cartInfo: {
        fontSize: 16,
        marginVertical: 8,
    },
});

export default AfterLoginScreen;
