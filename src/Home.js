import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, ImageBackground, Image, ScrollView, Alert, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons'; 
import { Button, TextInput, Snackbar } from 'react-native-paper';    
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const entries_carosels = [
                            {
                                title:"Curry, Thyme",
                                text: "2,000",
                                image: 'https://www.monsterinsights.com/wp-content/uploads/2019/11/breathtaking-online-shopping-statistics-you-never-knew.png'
                            },
                            {
                                title:"Noddles",
                                text: "4,500",
                                image: 'https://www.whizsky.com/wp-content/uploads/2020/12/eCommerce-Website-Design.jpg'
                            }, 
                            {
                                title:"Fish",
                                text: "32,000",
                                image: 'https://media.istockphoto.com/photos/online-shopping-picture-id923079848?k=6&m=923079848&s=612x612&w=0&h=VHDx1E0lmVYT-WpkLWFJhE-Rx8wDXxDUCl5XHU_KA4M='
                            }, 
                            {
                                title:"Stock",
                                text: "400,000",
                                image: 'https://image.freepik.com/free-vector/customer-shopping-online-during-covid-19-stay-home-avoid-spreading-coronavirus_40876-1720.jpg'
                            }, 
                        ];

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [ loading, setLoading ] = useState(true);
  const [ userDetails, setUserDetails ] = useState({});
  const [ allProducts, setAllProducts ] = useState([]);

  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {

              // Prevent default behavior of leaving the screen
              e.preventDefault();

              // Prompt the user before leaving the screen
              Alert.alert(
                'Log out',
                'Are you sure you want to logout?',
                [
                  { text: "Don't leave", style: 'cancel', onPress: () => {} },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    // If the user confirmed, then we dispatch the action we blocked earlier
                    // This will continue the action that had triggered the removal of the screen
                    onPress: async () =>{
                        await SecureStore.deleteItemAsync('user_details');
                        await SecureStore.deleteItemAsync('token');
                        navigation.navigate('Login');
                    },
                  },
                ]
              );
            });
    setLoading(true);
    getAllProducts();
  }, [])

  const getAllProducts = async () => {
    setLoading(true);
    fetch(`${live_url}product` )
      .then(response => response.json())
      .then(async(json) => {
        if(json['status'] == true ){
          setAllProducts(json.data); 
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
  } 

  const  _renderItem = ({item, index}) => {
      return (
          <View style={styles.slide}>
            <ImageBackground source={{ uri: item.image  }} style={styles.slideImage} />
          </View>
      );
  }

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" /> 
      </View>
    )
  }

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={24} color="#4BA716" onPress={() => navigation.toggleDrawer() }  />
          <Text style={styles.headerText}>Nimerex</Text>
          <Feather name="search" size={24} color="#4BA716" size={26} onPress={() => navigation.navigate('Search') }  />
        </View>
        <View style={styles.body}>
          <ScrollView style={{ width, marginBottom: 100 }}> 
            <View style={styles.caroselCon}>
                <Carousel
                  // ref={(c) => { _carousel = c }}
                  data={entries_carosels}
                  renderItem={_renderItem}
                  sliderWidth={width - 40}
                  itemWidth={width - 40}
                />
            </View> 
            {
              allProducts["category"] &&
              Object.keys(allProducts["category"]).map((item, index) => {
                // console.log(allProducts["category"][item])
                if(allProducts["category"][item].data.length < 1){
                  return null;
                }
                return(
                  <>
                    <View style={styles.productListCon} key={index}>
                      <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.productListConTitle}>{ item.replace('_',' ') }</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Category', { category: allProducts["category"][item] }) }>
                          <Text style={[styles.productListConTitle, { color: '#4BA716', fontFamily: 'Montserrat-Regular', fontSize: 12, right: 10  }]}>view more</Text>
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.productListConSlides} horizontal showsHorizontalScrollIndicator={false} >
                        {

                          allProducts["category"][item].data.map((item2, index2) => {
                            if(index2 > 4){
                              return null;
                            }
                            return (
                                <Pressable onPress={() => navigation.navigate('Product', { category: item2 }) } style={styles.slideProduct} key={index2}>
                                    <Image source={{ uri:  live_url_image+item2.images[0].url }} borderRadius={5} resizeMode="contain" style={styles.slideProductImage} />
                                    <View style={styles.slideProductCon}>
                                      <Text style={styles.slideProductConTitle}>{ item2.name }</Text>
                                      <Text style={styles.slideProductConPrice}>{'\u0024'}{ item2.price }</Text>
                                      <View style={{ width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                                          <Button onPress={() => addToSavedItem(item2)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={[styles.slideProductConButton, { width: '20%' }]}>
                                              <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
                                          </Button>
                                          <Button onPress={() => addToCart(item2)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.slideProductConButton}>
                                              + Cart
                                          </Button>
                                      </View>
                                    </View>
                                </Pressable>
                              )
                          })
                        }
                      </ScrollView>
                    </View>
                    {
                      index % 2 === 0 &&
                         <View style={styles.addCon}>
                           <Text style={styles.addConText}>ADs Section</Text>
                         </View>
                    }
                  </>
                )
              })
            } 
          </ScrollView>
        </View>
    </View>
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
  productListCon:{ 
    width,  
    height: height / 3,  
    padding: 5,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  productListConTitle:{
    fontSize: 16,
    fontFamily: 'Montserrat-Bold', 
    color: '#000',
    textTransform: 'capitalize',
    bottom: 5
  },
  productListConSlides:{
    width, 
    height: '100%', 
    // flexDirection:'row',
    // justifyContent: 'center',
  },
  slideProduct:{
    width: width/2.2,
    height: '100%',
    padding: 5,
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
    color: '#4BA716',
  },
  slideProductConButton:{
    width: '50%',
    height: 35,
    color: '#fff',
    backgroundColor: '#4BA716'
  },  
  addCon:{
    width, 
    height: height / 7,  
    backgroundColor: 'rgba(0,0,0, .3)',
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addConText:{
    fontSize: 25,
    fontFamily: 'Montserrat-Bold', 
    color: 'grey',
  }
}); 