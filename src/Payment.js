import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper'; 
import * as Animatable from 'react-native-animatable';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window'); 

export default function PaymentScreen({ navigation, route }) { 
  const [ paymentMode, setPaymentMode ] = useState('card');
  const [ carts, setCarts ] = useState(route.params.carts);
  const [ loading, setLoading ] = useState(true);
  const [ cartTotal, setCartTotal ] = useState(0);
  const [ fax, setFax ] = useState(0);

  useEffect(() => {
    getFaxs();
    (()=>{
      var total = 0;
      carts.map((item, index) => {
        total += item.price * item.qty
      })
      setCartTotal(total);
    })()
  },[navigation])

  const getFaxs = async () => {
    setLoading(true);
    fetch(`${live_url}tax` )
      .then(response => response.json())
      .then(async(json) => {
        console.log(json);
        if(json['status'] == true ){  
          setFax(json.data); 
        }else{
          // setMessage(json.responseMessage); 
          // setVisible(true)
        }
      })
      .catch(error => console.error(error))
      .finally(res => setLoading(false))
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
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Payment</Text> 
          <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} />
        </View>
        <View style={styles.body}>
            <View style={styles.cartCon}>
                <DataTable>
                  {/* <DataTable.Header>
                      <DataTable.Title>Total Cart</DataTable.Title>
                      <DataTable.Title numeric>Price</DataTable.Title>  
                  </DataTable.Header> */}
      
                  <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Total Price</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'}{ cartTotal.toFixed(2) }</DataTable.Cell>
                  </DataTable.Row>
                  
                  {/* <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Vat</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'}30</DataTable.Cell>
                  </DataTable.Row> */}
                  
                  <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Fax</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'} { ((Number(fax)/ 100) * Number(cartTotal)).toFixed(2) } </DataTable.Cell>
                  </DataTable.Row> 
                  
                  <DataTable.Row>
                      <DataTable.Cell>
                      <Text style={styles.itemTitle}>Toatl Payable</Text>
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{'\u0024'}{ ( cartTotal + ((Number(fax)/ 100) * Number(cartTotal))).toFixed(3) }</DataTable.Cell>
                  </DataTable.Row> 

                </DataTable> 
                {/* <Text style={{ fontSize: 15, fontFamily: 'Montserrat-Regular', color: '#000', textAlign: 'center', top: 10 }}>Select payment mode</Text>
                <Animatable.View animation="zoomInDown" style={styles.butonBottom}>
                    <TouchableOpacity onPress={() => setPaymentMode('card') } style={ paymentMode == 'card' ? [styles.button2, { backgroundColor: '#fff', borderRadius: 5 }] : styles.button2 }> 
                    <Text style={ paymentMode == 'card' ? styles.button2Text : [styles.button2Text, { color: '#fff' }] }>Card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => setPaymentMode('paypal') } style={ paymentMode == 'paypal' ? [styles.button2, { backgroundColor: '#fff', borderRadius: 5 }] : styles.button2 }> 
                    <Text style={ paymentMode == 'paypal' ? styles.button2Text : [styles.button2Text, { color: '#fff' }] }>Paypal</Text>
                    </TouchableOpacity>
                </Animatable.View> */}
            </View> 
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>                  
                <Button mode="contained" color="#b22234" style={styles.button} onPress={() => navigation.navigate('GooglePayment', {
                                                                                                                                      totalPayment: cartTotal + ((Number(fax)/ 100) * Number(cartTotal)),
                                                                                                                                      carts: carts,
                                                                                                                                      fax:fax
                                                                                                                                    }) 
                                                                                                                                  } >
                    Confirm payment
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
    padding: 10,
    marginTop: 20,
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
  },
  butonBottom:{
    width: '60%',
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    flexDirection: 'row',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 20,
  },
  button2:{
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button2Text:{
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
    color: '#000'
  }
});
