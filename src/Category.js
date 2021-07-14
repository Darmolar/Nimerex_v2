import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput } from 'react-native-paper'; 
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network'; 
 
const { width, height } = Dimensions.get('window');
   
const  RenderProductsItem = ({item, index}) => (
    <Pressable key={index} onPress={() => navigation.navigate('Product', { category: item }) }  style={styles.slideProduct}>
        <Image source={{ uri: live_url_image+item.images[0].url }} borderRadius={5} resizeMode="contain" style={styles.slideProductImage} />
        <View style={styles.slideProductCon}>
            <Text style={styles.slideProductConTitle}>{ item.name }</Text>
            <Text style={styles.slideProductConPrice}>{'\u0024'}{ item.price }</Text>       
            <View style={{ width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                <Button onPress={() => addToSavedItem(item)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={[styles.slideProductConButton, { width: '20%' }]}>
                    <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
                </Button>
                <Button onPress={() => addToCart(item)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.slideProductConButton}>
                    + Cart
                </Button>
            </View>
        </View>
    </Pressable>
); 

export default function CategoryScreen({ navigation, route }) {
  const [ products, setProducts ] = useState(route.params.category);

  const renderItem = ({ item }) => (
    <RenderProductsItem item={item} />
  );

  return (
    <SafeAreaView  style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
            <MaterialCommunityIcons name="menu" size={24} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
                <Text style={styles.headerText}>{ products[0]['category_name'] }</Text> 
            <MaterialIcons name="search" color="#b22234" size={26} /> 
        </View>
        <View style={styles.body}> 

            <View style={{ width: width, marginBottom: 100 }}>                
                <FlatList
                    data={products} 
                    renderItem={renderItem}
                    keyExtractor={item => item.id} 
                    horizontal={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  }, 
  header:{
    marginTop: 40,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
  headerText:{
    fontSize: 20,
    fontFamily: 'Montserrat-Bold', 
    color: '#000',
  },
  body:{
    width
  },
  searchCon:{
    width,
    height: 40, 
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  search:{
    width: '80%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center', 
  },
  searchInput:{
    width: '80%',
    height: '100%',
    left: 10,
    fontSize: 15,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  slideProduct:{
    width: width / 2,
    height: 250,
    padding: 10
  },
  slideProductImage:{
    width: '100%',
    height: '50%',
  },
  slideProductCon:{
    width: '100%',
    height: "50%",
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slideProductConTitle:{
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    textAlign: 'center'
  },
  slideProductConPrice:{
    fontSize: 12,
    fontFamily: 'Montserrat-Light',
    color: 'blue',
  },
  slideProductConButton:{
    width: '50%',
    height: 35,
    color: '#fff',
    backgroundColor: 'blue'
  },
  slideProductConButtonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Light', 
    color: '#fff',
  },
});
