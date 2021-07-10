import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window');

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
                            {
                                title:"Stock3",
                                text: "500,000",
                                image: 'https://image.freepik.com/free-vector/customer-shopping-online-during-covid-19-stay-home-avoid-spreading-coronavirus_40876-1720.jpg'
                            }, 
                            {
                                title:"New Stock",
                                text: "10,000",
                                image: 'https://image.freepik.com/free-vector/customer-shopping-online-during-covid-19-stay-home-avoid-spreading-coronavirus_40876-1720.jpg'
                            }, 
                        ];
   
const  RenderProductsItem = ({item, index}) => (
        <View style={styles.slideProduct}>
            <Image source={{ uri: item.image }} borderRadius={5} resizeMode="cover" style={styles.slideProductImage} />
            <View style={styles.slideProductCon}>
                <Text style={styles.slideProductConTitle}>{ item.title }</Text>
                <Text style={styles.slideProductConPrice}>{'\u0024'}{ item.text }</Text>       
                <View style={{ width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                    {/* <Button uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={[styles.slideProductConButton, { width: '20%' }]}>
                        <MaterialCommunityIcons name="heart-outline" size={20} color="#fff" />
                    </Button> */}
                    <Button uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.slideProductConButton}>
                        + Subscription
                    </Button>
                </View>
            </View>
        </View>
    ); 

export default function SubscriptionProductsScreen({ navigation }) {
 
  const renderItem = ({ item }) => (
    <RenderProductsItem item={item} />
  );

  return (
    <SafeAreaView  style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={24} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Products</Text> 
          <MaterialCommunityIcons name="cart" size={24} color="#b22234" size={26} onPress={() => navigation.navigate('SubscriptionCart') } />
        </View>
        <View style={styles.body}>  
            <View style={{ width: width, marginBottom: 100 }}>                
                <FlatList
                    data={entries_carosels} 
                    renderItem={renderItem}
                    keyExtractor={item => item.text} 
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
    height: '60%',
  },
  slideProductCon:{
    width: '100%',
    height: "40%", 
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slideProductConTitle:{
    fontSize: 15,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  slideProductConPrice:{
    fontSize: 13,
    fontFamily: 'Montserrat-Regular', 
    color: 'blue',
  },
  slideProductConButton:{
    width: '50%',
    height: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center'
  }, 
  slideProductConButtonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Light', 
    color: '#fff',
  },
});
