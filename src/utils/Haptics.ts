import * as Haptics from 'expo-haptics';
import {Platform, Vibration} from "react-native";


export const lightHaptic = async () => {
    if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
        Vibration.vibrate(50);
    }
}

export const mediumHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
};


export const strongHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Small delay between haptics
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
};


export const complexHaptic = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(resolve => setTimeout(resolve, 100));
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};

export const patternHaptic = async () => {
    try {
        // Start with heavy impact
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        await new Promise(resolve => setTimeout(resolve, 100));

        // Follow with medium impact
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        await new Promise(resolve => setTimeout(resolve, 50));

        // End with notification
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
        console.log('Error triggering haptics:', error);
    }
};

export const errorHaptic = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
};
