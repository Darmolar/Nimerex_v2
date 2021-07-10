import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, ImageBackground, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from 'react-native-vector-icons';
import Carousel from 'react-native-snap-carousel';
import { Button, TextInput } from 'react-native-paper'; 
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network'; 
 
const { width, height } = Dimensions.get('window');


export default function ProductScreen({ navigation, route }) {
    const [ products, setProducts ] = useState(route.params.category); 

    const  _renderItem = ({item, index}) => {
        return (
            <View style={styles.slide}>
                <Image  source={{ uri: live_url_image+item.url }} style={styles.slideImage} />
            </View>
        );
    }

    return (
        <SafeAreaView  style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <MaterialIcons name="arrow-back-ios" size={24} color="#b22234" onPress={() => navigation.goBack() }   />
                    <Text style={styles.headerText}>{ products['category_name'] }</Text> 
                <MaterialIcons name="search" color="#b22234" size={26} /> 
            </View>
            <View style={styles.body}> 
                <View style={styles.caroselCon}>
                    <Carousel
                    // ref={(c) => { _carousel = c }}
                    data={products['images']}
                    renderItem={_renderItem}
                    sliderWidth={width - 40}
                    itemWidth={width - 40}
                    />
                </View> 
                <View style={styles.productCon}>
                    <View style={{ padding: 10, width: '100%', marginVertical: 5 }}>
                        <Text style={styles.prodcutTitle}>{ products.name }</Text>
                    </View>
                    <View style={{ width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                        <Button onPress={() => addToSavedItem(item2)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={[styles.slideProductConButton ]}>
                            <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
                        </Button>
                        <Button onPress={() => addToCart(item2)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.slideProductConButton}>
                            + Cart
                        </Button>
                    </View>
                    <View style={{ padding: 10, width: '100%', marginVertical: 5 }}>
                        <Text style={styles.prodcutdescription}>{ products.description.replace( /(<([^>]+)>)/ig, '') }</Text>
                    </View>
                    
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
  caroselCon:{
    width, 
    height: height/5, 
    flexDirection:'row',
    justifyContent: 'center',
  },
  slide:{
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  slideImage:{
    flex: 1,
    width: '100%',
    height: '100%',
  }, 
  productCon:{
    width,
    padding: 10,
  },
  prodcutTitle:{
    fontSize: 15,
    fontFamily: 'Montserrat-Bold', 
    color: '#000'
  },
  prodcutdescription:{
    fontSize: 15,
    fontFamily: 'Montserrat-Regular', 
    textAlign: 'left',
    color: '#000'
  },
  slideProductConButton:{
    width: '40%',
    height: 30, 
    color: '#fff',
    backgroundColor: 'blue'
  }, 
});
