import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons'; 
import { Button, TextInput, Snackbar, Modal } from 'react-native-paper';    
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window');

const  RenderProductsItem = ({ navigation, item, index}) => { 
  return (      
    <Pressable onPress={() => navigation.navigate('Product', { category: item }) }  style={styles.slideProduct} >
        <Image source={{ uri:  live_url_image+item.images[0].url }} borderRadius={5} resizeMode="contain" style={styles.slideProductImage} />
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
  )
}

export default function SearchScreen({ navigation }) {
  const [ loading, setLoading ] = useState(true);
  const [ userDetails, setUserDetails ] = useState({});
  const [ allProducts, setAllProducts ] = useState([]);
  const [ nextLink, setNextLink ] = useState('');
  const [ loadingMore, setLoadingMore ] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [ allCategories, setAllCategories ] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllProducts();
    getAllCategpries();
  }, [navigation])

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
 
  const getAllCategpries = async () => {
    setLoading(true);
    fetch(`${live_url}category` )
      .then(response => response.json())
      .then(async(json) => { 
        if(json['status'] == true ){  
          // console.log(json.data);
          setAllCategories(json['data']); 
        } 
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
  }   
 
  const getProductByCategory = async (id) => {
    console.log(id)
    setLoading(true);
    fetch(`${live_url}category/product/${id}` )
      .then(response => response.json())
      .then(async(json) => {
        // console.log(json);
        if(json['status'] == true ){  
          // console.log(json.data);
          setAllProducts(json['data']);
          setNextLink('');
          hideModal();
        }else{
          // setMessage(json.responseMessage);  
          // setVisible(true)
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
  }

  const getAllProducts = async () => {
    setLoading(true);
    fetch(`${live_url}product` )
      .then(response => response.json())
      .then(async(json) => {
        if(json['status'] == true ){  
          // console.log(json.data);
          setAllProducts(json['data']['products']['data']);
          setNextLink(json['data']['products']['next_page_url']) 
        }else{
          // setMessage(json.responseMessage); 
          // setVisible(true)
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
  } 
 
  const loadMore = async (nextLink) => {
    setLoadingMore(true);
    fetch(`${nextLink}` )
      .then(response => response.json())
      .then(async(json) => {
        // console.log(json['data']['products']);
        if(json['status'] == true ){   
          var newData = json['data']['products']['data']; 
          var newArray = [ ...allProducts, ...newData ];
          setAllProducts(newArray);
          setNextLink(json['data']['products']['next_page_url']) 
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoadingMore(false))
  }  

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" /> 
      </View>
    )
  }
  const renderItem = ({ item }) => (
    <RenderProductsItem item={item} />
  );

  return (
    <SafeAreaView  style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={24} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Search 
              {
                loadingMore &&
                <ActivityIndicator color="#000" />
              } 
          </Text> 
          <MaterialCommunityIcons name="filter-plus-outline" size={24} color="#b22234" size={26} onPress={() => showModal() } />
        </View>
        <View style={styles.body}>
            <View style={styles.searchCon}>
                <View style={styles.search}> 
                    <TextInput 
                      mode="outlined" 
                      style={{ height: 30, fontSize: 12, width: '100%', }} 
                      label="Search ...."
                      left={<TextInput.Icon name="layers-search"  color="#b22234" />}
                    />
                </View>
            </View>

            <View style={{ width: width, marginBottom: 220 }}>         
                <FlatList
                    data={allProducts} 
                    renderItem={renderItem}
                    keyExtractor={item => item.id} 
                    horizontal={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    navigation={navigation}
                    onEndReached={() => {
                      if(nextLink !== ''){
                        loadMore(nextLink)
                      }
                    }}
                />
                
            </View> 
        </View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text style={styles.modalHeader}>Filter by Category.</Text>
          <View style={styles.listCon}>
            { 
              allCategories.length > 0 &&
              allCategories.map((item, index) => (
                <TouchableOpacity key={index} style={styles.actionButton} onPress={() => getProductByCategory(item.id) } >
                    <Text style={styles.actionButtonText}>{ item.name }</Text>
                </TouchableOpacity> 
              ))
            }
          </View>
        </Modal>
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
  modal:{
    backgroundColor: 'white', 
    padding: 20
  },
  listCon:{
    width: '100%',
  },
  actionButton:{
    width: '100%',
    height: 30,
    justifyContent: 'center',
    padding: 10,
    borderBottomWidth: .5,
    borderColor: 'grey',
    marginVertical: 10,
    borderRadius: 10, 
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  actionButtonText:{
    fontSize: 13,
    fontFamily: 'Montserrat-Bold', 
    color: '#000',
  }
});
