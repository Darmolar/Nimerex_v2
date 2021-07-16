import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, Snackbar, Modal, FAB } from 'react-native-paper';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem, ToastAndroid } from '../Network';

const { width, height } = Dimensions.get('window');

export default function SubscriptionProductsScreen({ navigation, route }) {
  const [ loading, setLoading ] = useState(true);
  const [ userDetails, setUserDetails ] = useState({});
  const [ allProducts, setAllProducts ] = useState([]);
  const [ nextLink, setNextLink ] = useState('');
  const [ loadingMore, setLoadingMore ] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [ allCategories, setAllCategories ] = useState([]);
  const sub_details = route.params.item;

  useEffect(() => {
    setLoading(true);
    getUserDetails();
    getAllProducts();
    getAllCategpries();
  }, [navigation])

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const getUserDetails = async () => {
       let token = await SecureStore.getItemAsync('token');
       if(token !== null){
          let data = await SecureStore.getItemAsync('user_details');
          if(data !== null){
             setUserDetails(JSON.parse(data));
             setLoading(false);
          }
       }else{
       }
 }

  const getAllCategpries = async () => {
    setLoading(true);
    fetch(`${live_url}category` )
      .then(response => response.json())
      .then(async(json) => {
        if(json['status'] == true ){
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
           console.log(json['data']['products']['data']);
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

  const addToSub = async (item) => {
      var new_payment_data = new FormData;
      new_payment_data.append('user_id', userDetails.id);
      new_payment_data.append('subscription_id', sub_details.id);
      new_payment_data.append('product_id', item.id);
        fetch(`${live_url}subscription/product/add`,{
         method: 'POST',
         headers: {
           Accept: 'application/json',
           'Content-Type': 'multipart/form-data'
         },
         body: new_payment_data
        })
          .then(response => response.json())
          .then((json) => {
//            console.log(json)
            if(json.status == true){
                alert(json.message);
            }else{
                alert(json.message);
            }
          })
          .catch(error => console.error(error))
          .finally(res => console.log());
  }

  if(loading){
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

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
                    renderItem={(product, index) => {
                        var item = product.item;
                        return(
                            <Pressable onPress={() => navigation.navigate('Product', { category: item }) }  style={styles.slideProduct} >
                                <Image source={{ uri:  live_url_image+item.images[0].url }} borderRadius={5} resizeMode="contain" style={styles.slideProductImage} />
                                <View style={styles.slideProductCon}>
                                    <Text style={styles.slideProductConTitle}>{ item.name }</Text>
                                    <Text style={styles.slideProductConPrice}>{'\u0024'}{ item.price }</Text>
                                    <View style={{ width: '100%', flexDirection: 'row', alignContent: 'center', justifyContent: 'space-around' }}>
                                        <Button onPress={() => addToSub(item)} uppercase={false} mode="contained" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.slideProductConButton}>
                                            + Subscription
                                        </Button>
                                    </View>
                                </View>
                            </Pressable>
                          )
                    }}
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
        <FAB
            style={styles.fab}
            small
            icon="plus"
            label="Proceed"
            onPress={() =>  navigation.navigate('SubscriptionCart', { item: sub_details }) }
          />
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
    width: '80%',
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#b22234',
    color: '#fff'
 },
});
