import React, {ReactNode, useMemo, useRef} from 'react';
import {StyleSheet,} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';


interface RestaurantsBottomSheetProps {
    children: ReactNode;
}

const RestaurantsBottomSheet: React.FC<RestaurantsBottomSheetProps> = ({children}) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

    // Fallback or loading content
    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            handleIndicatorStyle={styles.bottomSheetHandle}
        >
            <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                {children}
            </BottomSheetScrollView>
        </BottomSheet>
    )
};


const styles = StyleSheet.create({

    bottomSheetContent: {
        padding: 16,

    },
    bottomSheetHandle: {

        backgroundColor: '#ccc',
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 8,

    },


});

export default RestaurantsBottomSheet;
