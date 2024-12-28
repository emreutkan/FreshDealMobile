// components/LoadingOverlay.tsx
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const LoadingOverlay: React.FC = () => (
    <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#0000ff"/>
    </View>
);

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LoadingOverlay;
