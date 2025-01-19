import React, {useEffect} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

interface CheckoutSuccessProps {
    onAnimationComplete: () => void;
}

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({onAnimationComplete}) => {
    // Animation values
    const rotateAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(0);
    const bounceAnim = new Animated.Value(0);

    useEffect(() => {
        // Sequence of animations
        Animated.sequence([
            // First rotate and scale up
            Animated.parallel([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
                    useNativeDriver: true,
                }),
            ]),
            // Then do a small bounce
            Animated.spring(bounceAnim, {
                toValue: 1,
                friction: 4,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Wait a bit before navigating
            setTimeout(onAnimationComplete, 500);
        });
    }, []);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const scale = Animated.add(
        scaleAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }),
        bounceAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.2],
        })
    );

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.checkmarkContainer,
                    {
                        transform: [
                            {rotate: rotation},
                            {scale},
                        ],
                    },
                ]}
            >
                <MaterialIcons name="check-circle" size={120} color="#50703C"/>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CheckoutSuccess;