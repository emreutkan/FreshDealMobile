import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import AddressBar from "@/src/features/homeScreen/components/AddressBar";
import {scaleFont} from "@/src/utils/ResponsiveFont";
import {Feather, Ionicons} from "@expo/vector-icons";
import {useSafeAreaInsets} from "react-native-safe-area-context";

interface HeaderProps {
    isScrolled: boolean;
    activeTab: string; // New prop for active tab
}

const CollapsedSearchBar: React.FC = React.memo(() => (
    <View style={styles.searchBarContainer}>
        <TouchableOpacity>
            <Feather name="search" size={24} color="#000"/>
        </TouchableOpacity>
    </View>
));

const ExpandedSearchBar: React.FC = () => (
    <View style={styles.expandedSearchBarContainer}>
        <TextInput
            style={styles.expandedSearchBar}
            placeholder="Search for restaurants..."
            placeholderTextColor="#999"
        />
    </View>
);
const FavoritesBar: React.FC = () => {

    const handleRouteToFavoritesScreen = () => {

    };

    return (
        <TouchableOpacity
            onPress={handleRouteToFavoritesScreen}
            style={styles.favoritesBarContainer}
        >
            <Ionicons name="heart-outline" size={scaleFont(24)} color="#000"/>
        </TouchableOpacity>
    );
};
const Header: React.FC<HeaderProps> = ({isScrolled, activeTab}) => {
    const animation = useRef(new Animated.Value(isScrolled ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: isScrolled ? 1 : 0,
            duration: 320,
            useNativeDriver: false,
        }).start();
    }, [isScrolled]);

    // Interpolations for dynamic styles
    const headerHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [scaleFont(160), scaleFont(110)], // Expanded to Collapsed height
    });

    const searchBarOpacity = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1], // ExpandedSearchBar to CollapsedSearchBar
    });
    const insets = useSafeAreaInsets();

    return (
        <Animated.View style={[
            styles.header,
            {height: headerHeight},
            {paddingTop: insets.top},
            activeTab === 'HomeMapView' ? styles.transparentHeader : null
        ]}>
            <View style={styles.container}>

                <View style={styles.topRow}>

                    <View style={styles.addressBarContainer}>
                        <AddressBar/>
                    </View>


                    <View style={styles.iconContainer}>
                        <FavoritesBar/>
                        {isScrolled && (
                            <Animated.View style={[styles.collapsedSearchWrapper, {opacity: searchBarOpacity}]}>
                                <CollapsedSearchBar/>
                            </Animated.View>
                        )}
                    </View>
                </View>


                {!isScrolled && (
                    <Animated.View style={[styles.expandedSearchWrapper, {opacity: searchBarOpacity}]}>
                        <ExpandedSearchBar/>
                    </Animated.View>
                )}
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        borderColor: '#b2f7a5',
        borderBottomLeftRadius: scaleFont(20),
        borderBottomRightRadius: scaleFont(20),
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 9999,
        overflow: 'hidden',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: scaleFont(10),
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: 70, // Fixed height for the top row
    },
    addressBarContainer: {
        maxWidth: '65%', // AddressBar limited to 50% of the parent width
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    collapsedSearchWrapper: {
        marginLeft: scaleFont(10),
    },
    expandedSearchWrapper: {
        // marginTop: scaleFont(10),
    },
    expandedSearchBarContainer: {
        paddingTop: scaleFont(10),
        paddingHorizontal: scaleFont(10),
    },
    expandedSearchBar: {
        paddingVertical: scaleFont(10),
        paddingHorizontal: scaleFont(15),
        borderRadius: scaleFont(20),
        backgroundColor: '#f9f9f9',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    searchBarContainer: {
        paddingRight: scaleFont(10),
    },
    favoritesBarContainer: {
        paddingRight: scaleFont(10),
    },
    transparentHeader: {
        backgroundColor: "rgba(255, 255, 255, 0.85)",
    },
});

export default Header;

////
//
// import React, {useEffect, useRef} from 'react';
// import {Animated, Platform, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
// import AddressBar from "@/src/features/homeScreen/components/AddressBar";
// import {scaleFont} from "@/src/utils/ResponsiveFont";
// import {Feather, Ionicons} from "@expo/vector-icons";
// import {useSafeAreaInsets} from "react-native-safe-area-context";
// import {BlurView} from 'expo-blur';
//
// interface HeaderProps {
//     isScrolled: boolean;
//     activeTab: string; // New prop for active tab
// }
//
// const CollapsedSearchBar: React.FC = React.memo(() => (
//     <View style={styles.searchBarContainer}>
//         <TouchableOpacity>
//             <Feather name="search" size={24} color="#000"/>
//         </TouchableOpacity>
//     </View>
// ));
//
// const ExpandedSearchBar: React.FC = () => (
//     <View style={styles.expandedSearchBarContainer}>
//         <TextInput
//             style={styles.expandedSearchBar}
//             placeholder="Search for restaurants..."
//             placeholderTextColor="#999"
//         />
//     </View>
// );
// const FavoritesBar: React.FC = () => {
//
//     const handleRouteToFavoritesScreen = () => {
//
//     };
//
//     return (
//         <TouchableOpacity
//             onPress={handleRouteToFavoritesScreen}
//             style={styles.favoritesBarContainer}
//         >
//             <Ionicons name="heart-outline" size={scaleFont(24)} color="#000"/>
//         </TouchableOpacity>
//     );
// };
// const Header: React.FC<HeaderProps> = ({isScrolled, activeTab}) => {
//     const animation = useRef(new Animated.Value(isScrolled ? 1 : 0)).current;
//
//     useEffect(() => {
//         Animated.timing(animation, {
//             toValue: isScrolled ? 1 : 0,
//             duration: 320,
//             useNativeDriver: false,
//         }).start();
//     }, [isScrolled]);
//
//     // Interpolations for dynamic styles
//     const headerHeight = animation.interpolate({
//         inputRange: [0, 1],
//         outputRange: [scaleFont(160), scaleFont(110)], // Expanded to Collapsed height
//     });
//
//     const searchBarOpacity = animation.interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 1], // ExpandedSearchBar to CollapsedSearchBar
//     });
//     const insets = useSafeAreaInsets();
//
//     return (
//         <Animated.View style={[
//             styles.headerContainer,
//             {height: headerHeight},
//             {paddingTop: insets.top}
//         ]}>
//             {Platform.OS === 'ios' ? (
//                 <BlurView
//                     intensity={60}
//                     tint="light"
//                     style={[
//                         StyleSheet.absoluteFillObject,
//                         styles.blurView
//                     ]}
//                 />
//             ) : (
//                 <View style={[
//                     StyleSheet.absoluteFillObject,
//                     styles.androidBackground
//                 ]}/>
//             )}
//
//             <View style={styles.contentContainer}>
//                 <View style={styles.topRow}>
//                     <View style={styles.addressBarContainer}>
//                         <AddressBar/>
//                     </View>
//
//                     <View style={styles.iconContainer}>
//                         <FavoritesBar/>
//                         {isScrolled && (
//                             <Animated.View style={[styles.collapsedSearchWrapper, {opacity: searchBarOpacity}]}>
//                                 <CollapsedSearchBar/>
//                             </Animated.View>
//                         )}
//                     </View>
//                 </View>
//
//                 {!isScrolled && (
//                     <Animated.View style={[styles.expandedSearchWrapper, {opacity: searchBarOpacity}]}>
//                         <ExpandedSearchBar/>
//                     </Animated.View>
//                 )}
//             </View>
//         </Animated.View>
//     );
// };
//
// const styles = StyleSheet.create({
//     header: {
//         backgroundColor: "#fff",
//         borderColor: '#b2f7a5',
//         borderBottomLeftRadius: scaleFont(20),
//         borderBottomRightRadius: scaleFont(20),
//         shadowOffset: {width: 0, height: 8},
//         shadowOpacity: 0.08,
//         shadowRadius: 4,
//         elevation: 5,
//         zIndex: 9999,
//         overflow: 'hidden',
//         borderWidth: 1,
//         borderTopWidth: 0,
//     },
//     container: {
//         flex: 1,
//         paddingHorizontal: scaleFont(10),
//     },
//     topRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         // height: 70, // Fixed height for the top row
//     },
//     addressBarContainer: {
//         maxWidth: '65%', // AddressBar limited to 50% of the parent width
//     },
//     iconContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'flex-end',
//     },
//     collapsedSearchWrapper: {
//         marginLeft: scaleFont(10),
//     },
//     expandedSearchWrapper: {
//         // marginTop: scaleFont(10),
//     },
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
//     searchBarContainer: {
//         paddingRight: scaleFont(10),
//     },
//     favoritesBarContainer: {
//         paddingRight: scaleFont(10),
//     },
//     blurContainer: {
//         borderBottomLeftRadius: scaleFont(20),
//         borderBottomRightRadius: scaleFont(20),
//         borderColor: '#b2f7a5',
//         borderWidth: 1,
//         borderTopWidth: 0,
//     },
//     headerBlurBackground: {
//         backgroundColor: 'rgba(255, 255, 255, 0.7)', // more transparent for blur effect
//     },
//     headerContainer: {
//         overflow: 'hidden',
//         zIndex: 9999,
//         borderBottomLeftRadius: scaleFont(20),
//         borderBottomRightRadius: scaleFont(20),
//         borderColor: '#b2f7a5',
//         borderWidth: 1,
//         borderTopWidth: 0,
//     },
//     blurView: {
//         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     },
//     androidBackground: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     },
//     contentContainer: {
//         flex: 1,
//         paddingHorizontal: scaleFont(10),
//     },
// });
//
// export default Header;
