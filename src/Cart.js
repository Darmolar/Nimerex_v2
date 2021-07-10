
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

  useEffect(() => {
    getCarts();
  },[navigation])
 
  const getCarts = async () => {
    setLoading(true);
    var cart_data = await SecureStore.getItemAsync('cart_item_item')
    if(cart_data !== null){
      console.log(JSON.parse(cart_data))
      setCarts(JSON.parse(cart_data));
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
  }

  const removeItem = (item, index) => {   
    let cart = carts.find((pr) => pr.id === item.id); 
    const updatedcart = carts.filter(p =>  item.id !== p.id );
    setCarts(updatedcart);
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
        <View style={styles.body}>

          <View style={styles.cartCon}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Item</DataTable.Title>
                <DataTable.Title >Price</DataTable.Title>
                <DataTable.Title >Quantitiy</DataTable.Title>
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
                      <DataTable.Cell>
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
          </View>
          
          <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>                  
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('Payment', { carts })} >
                    Proceed to payment
                </Button>
            </View>
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
  },
  quantityConMiddle:{
    width: '60%',
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
