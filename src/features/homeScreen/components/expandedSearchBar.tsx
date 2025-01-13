// // ExpandedSearchBar.tsx
//
// import React, {forwardRef, useEffect} from 'react';
// import {InteractionManager, StyleSheet, TextInput, View} from 'react-native';
// import {scaleFont} from "@/src/utils/ResponsiveFont";
//
// interface ExpandedSearchBarProps {
//     shouldFocus: boolean;
//     onFocus?: () => void; // Callback to notify Header after focusing
// }
//
// const ExpandedSearchBar = forwardRef<TextInput, ExpandedSearchBarProps>(({shouldFocus, onFocus}, ref) => {
//     const inputRef = React.useRef<TextInput>(null);
//
//     useEffect(() => {
//         if (shouldFocus) {
//             console.log('shouldFocus is true, attempting to focus TextInput');
//             const task = InteractionManager.runAfterInteractions(() => {
//                 setTimeout(() => {
//                     console.log('Focusing TextInput with delay');
//                     inputRef.current?.focus();
//                     if (onFocus) {
//                         onFocus(); // Notify Header that focusing is done
//                     }
//                 }, 100); // 100ms delay to ensure rendering is complete
//             });
//
//             // Cleanup in case the component unmounts before focus
//             return () => task.cancel();
//         }
//     }, [shouldFocus, onFocus]);
//
//     return (
//         <View style={styles.expandedSearchBarContainer}>
//             <TextInput
//                 ref={inputRef}
//                 style={styles.expandedSearchBar}
//                 placeholder="Search for restaurants..."
//                 placeholderTextColor="#999"
//                 // Optional: Add other TextInput props here
//             />
//         </View>
//     );
// });
//
// const styles = StyleSheet.create({
//     expandedSearchBarContainer: {
//         paddingTop: scaleFont(10),
//         paddingHorizontal: scaleFont(10),
//     },
//     expandedSearchBar: {
//         paddingVertical: scaleFont(10),
//         paddingHorizontal: scaleFont(15),
//         borderRadius: scaleFont(20),
//         backgroundColor: '#f9f9f9',
//         borderColor: '#e0e0e0',
//         borderWidth: 1,
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 1},
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 1,
//     },
// });
//
// export default ExpandedSearchBar;
