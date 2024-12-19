import React from 'react';
import {FlatList, Image, StyleSheet, Text, View} from 'react-native';

const AfterLoginScreen = () => {
    // Mock Data
    const Bakery = [
        {id: '1', name: 'Gurme Ev Yemekleri', image: require('@/assets/images/meal.png')},
        {id: '2', name: 'Baklava', image: require('@/assets/images/meal.png')},
        {id: '3', name: 'Dessert Special', image: require('@/assets/images/meal.png')},
    ];
    // Mock Data
    const patisserie = [
        {id: '1', name: 'Gurme Ev Yemekleri', image: require('@/assets/images/meal.png')},
        {id: '2', name: 'Baklava', image: require('@/assets/images/meal.png')},
        {id: '3', name: 'Dessert Special', image: require('@/assets/images/meal.png')},
    ];


    const renderBakery = ({item}) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage}/>
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    );


    const renderPatisserie = ({item}) => (
        <View style={styles.card}>
            <Image source={item.image} style={styles.cardImage}/>
            <Text style={styles.cardText}>{item.name}</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Bakery</Text>
            <FlatList
                data={Bakery}
                renderItem={renderBakery}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />
            <Text style={styles.sectionTitle}>Patisserie</Text>
            <FlatList
                data={patisserie}
                renderItem={renderPatisserie}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    searchContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
    },
    searchInput: {
        color: '#888',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    listContainer: {
        paddingVertical: 10,
    },
    card: {
        width: 150,
        marginRight: 12,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        padding: 8,
    },
    cardImage: {
        width: 130,
        height: 80,
        borderRadius: 8,
        marginBottom: 5,
    },
    cardText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    category: {
        alignItems: 'center',
        marginRight: 20,
    },
    categoryIcon: {
        width: 50,
        height: 50,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default AfterLoginScreen;
