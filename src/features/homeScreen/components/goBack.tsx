import React from 'react';
import {StyleSheet, TouchableOpacity,} from 'react-native';
import {Feather, Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from "@/src/utils/navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";


export const GoBackIcon: React.FC = () => {
    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

    const navigation = useNavigation<NavigationProp>();


    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
            <Feather name="arrow-left" size={24} color="#333"/>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    iconButton: {padding: 8},

});


export const GoBackIconWhite: React.FC = () => {

    type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
    const navigation = useNavigation<NavigationProp>();
    const inset = useSafeAreaInsets()
    return (
        <TouchableOpacity
            style={{
                padding: 8,
                zIndex: 9999,
                position: 'absolute',
                backgroundColor: '#fff',
                borderRadius: 50,
                left: inset.left,
                margin: 12,
                top: inset.top,

            }}
            onPress={() => navigation.goBack()}>
            <Ionicons

                name="arrow-back" size={24} color="#000"/>
            {/*<Ionicons name="arrow-left" size={24} color="#333"/>*/}
        </TouchableOpacity>
    )
}

