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
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({});
  const [ billingInfo, setBillingInfo ] = useState({
                                                    phone: '',
                                                    email: '',
                                                    suburb_or_town: '',
                                                    state_or_territory: '',
                                                    country: '',
                                                    post_code: '',
                                                    full_address: '',
                                                    suite_no: '',
                                                  });

  useEffect(() => {
    getFaxs();
    getUserDetails();
    (()=>{
      var total = 0;
      carts.map((item, index) => {
        total += item.price * item.qty
      })
      setCartTotal(total);
    })()
  },[navigation]);

  const getUserDetails = async () => {
     let token = await SecureStore.getItemAsync('token');
     if(token !== null){
        setIsLoggedIn(true);
        let data = await SecureStore.getItemAsync('user_details');
        if(data !== null){
           setUserDetails(JSON.parse(data));
           getBillingInfo(JSON.parse(data).id)
        }
     }else{
        setIsLoggedIn(false)
     }
   }

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

  const getBillingInfo = async (user_id) => {
        setLoading(true);
        fetch(`${live_url}address/find/${user_id}` )
          .then(response => response.json())
          .then(async(json) => {
            console.log(json);
            if(json.status == true ){
                setBillingInfo({
                               phone: json.data.phone,
                               email: json.data.email,
                               suburb_or_town: json.data.suburb_or_town,
                               state_or_territory: json.data.state_or_territory,
                               country: json.data.country,
                               post_code: json.data.post_code,
                               full_address: json.data.full_address,
                               suite_no: json.data.suite_no,
                             });
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
        <ScrollView style={styles.body}>
            {
            isLoggedIn == true ?
                <>
                    <View style={styles.billingCon}>
                        <View style={{ alignSelf: 'center', width: '95%', flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ height: 50, fontSize: 15, color: '#000', fontFamily: 'Montserrat-Regular' }}>Shipping Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('BillingInfo')}  >
                                <Text style={{ height: 50, fontSize: 12, color: '#b22234', fontFamily: 'Montserrat-Bold' }}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            (billingInfo.phone !== '' ||
                            billingInfo.email !== '' ||
                            billingInfo.suburb_or_town !== '' ||
                            billingInfo.state_or_territory !== '' ||
                            billingInfo.post_code !== '' ||
                            billingInfo.full_address !== '' ||
                            billingInfo.suite_no !== '' )
                            ?
                            <View style={{ width: '100%'}}>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Email</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.email }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Phone</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.phone }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Suite No</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.suite_no }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Town</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.suburb_or_town }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>State</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.state_or_territory }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Country</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.country }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Post Code</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell numeric>{ billingInfo.post_code }</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                  <DataTable.Cell>
                                    <Text style={styles.itemTitle}>Full Address</Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell >{ billingInfo.full_address }</DataTable.Cell>
                                </DataTable.Row>
                            </View>
                            :
                            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                                <Button mode="contained" color="#b22234" style={styles.button} onPress={() => navigation.navigate('BillingInfo') } >
                                    Update Billing Info
                                </Button>
                            </View>
                        }
                    </View>
                    <View style={styles.cartCon}>
                        <DataTable>
                          <DataTable.Row>
                              <DataTable.Cell>
                              <Text style={styles.itemTitle}>Total Price</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>{'\u0024'}{ cartTotal.toFixed(2) }</DataTable.Cell>
                          </DataTable.Row>

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
                    </View>
                    <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                        <Button disabled={billingInfo.phone === '' ||
                                          billingInfo.email === '' ||
                                          billingInfo.suburb_or_town === '' ||
                                          billingInfo.state_or_territory === '' ||
                                          billingInfo.post_code === '' ||
                                          billingInfo.full_address === '' ||
                                          billingInfo.suite_no === '' }
                                  mode="contained"
                                  color="#b22234"
                                  style={styles.button}
                                  onPress={() => navigation.navigate('GooglePayment', {
                                                                      totalPayment: cartTotal + ((Number(fax)/ 100) * Number(cartTotal)),
                                                                      carts: carts,
                                                                      fax:fax
                                                                    })
                                                                  } >
                            Confirm payment
                        </Button>
                    </View>
                </>
            :
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                <Button mode="contained" color="#b22234" style={styles.button}
                    onPress={() => navigation.navigate('Login') } >
                    Login before checkout
                </Button>
            </View>
        }
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
  },
  billingCon:{
    width,
    padding: 20,
  }
});
