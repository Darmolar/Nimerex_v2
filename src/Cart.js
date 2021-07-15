
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper';  
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network'; 

const { width, height } = Dimensions.get('window'); 

export default function CartScreen({ navigation }) { 
  const [ carts, setCarts ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  const [ cartTotal, setCartTotal ] = useState(0);
  const [ fax, setFax ] = useState(0);

  useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
            getCarts();
            getFaxs();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
  },[navigation])
 
  const getCarts = async () => {
    setLoading(true);
    var cart_data = await SecureStore.getItemAsync('cart_item_item')
    if(cart_data !== null){
      setCarts(JSON.parse(cart_data));
      getTotalInfo(JSON.parse(cart_data));
    }else{
      setCarts([]);
    }
    setLoading(false);
  }
  
  const removeToQuantity = (item, index) => {
    if(carts[index].qty > 1){ 
        let cart = carts.find((pr) => pr.id === item.id);
        cart.qty -= 1;
        const updatedcart = carts.map(p => {
            if (cart.id === p.id) return cart; 
            return p;
        });
        setCarts(updatedcart);
        getTotalInfo(updatedcart);
    } 
  }
  
  const addToQuantity = (item, index) => { 
    let cart = carts.find((pr) => pr.id === item.id);
    cart.qty += 1;
    const updatedcart = carts.map(p => {
        if (cart.id === p.id) return cart; 
        return p;
    });
    setCarts(updatedcart);
    getTotalInfo(updatedcart);
  }

  const removeItem = async (item, index) => {
    let cart = carts.find((pr) => pr.id === item.id); 
    const updatedcart = carts.filter(p =>  item.id !== p.id );
    setCarts(updatedcart);
    getTotalInfo(updatedcart);
    await SecureStore.deleteItemAsync('cart_item_item')
    await SecureStore.setItemAsync('cart_item_item', JSON.stringify(updatedcart));
    getCarts()
  }

  const getFaxs = async () => {
    setLoading(true);
    fetch(`${live_url}tax` )
      .then(response => response.json())
      .then(async(json) => {
        if(json['status'] == true ){
          setFax(json.data);
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
  }

  const getTotalInfo = (item) => {
      var total = 0;
        item.map((item, index) => {
          total += item.price * item.qty
        })
        setCartTotal(total);
  }

  if(loading){
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#000" />
      </View>
    )
  } 

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Cart</Text> 
          <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} />
        </View>
        <ScrollView style={styles.body}>

          <View style={styles.cartCon}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title >Price</DataTable.Title>
                <DataTable.Title numeric>Quantitiy</DataTable.Title>
                <DataTable.Title numeric>Action</DataTable.Title>
              </DataTable.Header>
              {
                carts.length > 0 &&
                carts.map((item, index) => {
                  return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell>
                        <Text style={styles.itemTitle}>{ item.name }</Text>
                      </DataTable.Cell>
                      <DataTable.Cell >{'\u0024'}{ item.price }</DataTable.Cell>
                      <DataTable.Cell numeric>
                        <View style={styles.quantityCon}>
                          <View style={styles.quantityConLeft}>
                            <TouchableOpacity style={styles.quantityButton} onPress={() => removeToQuantity(item, index) }>
                              <MaterialCommunityIcons name="minus" size={20} color="red" />
                            </TouchableOpacity>
                          </View>
                          <View style={styles.quantityConMiddle}>
                            <NewTextInput 
                              value="0"
                              keyboardType="number-pad"
                              style={styles.quantityConMiddleInput}
                              value={ item.qty.toString() }
                              editable={false}
                            />
                          </View>
                          <View style={styles.quantityConRight}>
                            <TouchableOpacity style={styles.quantityButton}  onPress={() => addToQuantity(item, index) }>
                              <MaterialCommunityIcons name="plus" size={20} color="green" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Button mode="text" labelStyle={{ fontFamily: 'Montserrat-Medium', }} onPress={() => removeItem(item, index) }  style={styles.closeButton}>
                          <MaterialCommunityIcons name="close" size={18} color="red" />
                        </Button>
                      </DataTable.Cell>
                    </DataTable.Row> 
      
                  )
                })
              }
            </DataTable>
            <View style={[styles.cartCon, { marginTop: 20 }]}>
                <DataTable>
                  <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Sub Total</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'}{ cartTotal.toFixed(2) }</DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Tax</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'} { ((Number(fax)/ 100) * Number(cartTotal)).toFixed(2) } </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                      <DataTable.Cell>
                        <Text style={[styles.itemTitle, { color: '#b22234', fontFamily: 'Montserrat-Medium' }]}>Total Payable</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        <Text style={{ color: '#b22234', fontFamily: 'Montserrat-Medium' }}>{'\u0024'}{ ( cartTotal + ((Number(fax)/ 100) * Number(cartTotal))).toFixed(3) }</Text>
                      </DataTable.Cell>
                  </DataTable.Row>

                </DataTable>
            </View>
          </View>
          
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('Payment', { carts })} >
                    Proceed to payment
                </Button>
            </View>
        </ScrollView>
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
    width
  },
  cartCon:{
    padding: 10
  },
  itemTitle:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  closeButton:{ 
    color: 'red', 
  },
  quantityCon:{
    width: '100%',
    height: 40,
    borderRadius: 5,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  quantityConLeft:{
    width: '20%',
    height: '100%',
    right: 10,
  },
  quantityConMiddle:{
    width: '80%',
    height: '100%',
  },
  quantityConRight:{
    width: '20%',
    height: '100%',
  },
  quantityButton:{ 
    width: '100%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  quantityConMiddleInput:{
    width: '100%',
    height: '80%',
    left: 5,
    fontSize: 12,
    fontFamily: 'Montserrat-Bold',
  },
  button:{
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#fff'
  } 
});
