import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import { Button, TextInput, DataTable, RadioButton   } from 'react-native-paper';
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
  const [ checked, setChecked ] = React.useState('card');
  const [ orders, setOrder ] = useState({});
  const [ shippingInfo, setShippingInfo ] = useState([]);
  const [ selectedOption, setSelectedOption ] = useState({});

  useEffect(() => {
    getFaxs();
    getUserDetails();
    (()=>{
      var total = 0;
      carts.map((item, index) => {
        total += item.price * item.qty
      })
      setCartTotal(total);
    })();
  },[navigation]);

  const getUserDetails = async () => {
     let token = await SecureStore.getItemAsync('token');
     if(token !== null){
        setIsLoggedIn(true);
        let data = await SecureStore.getItemAsync('user_details');
        if(data !== null){
           setUserDetails(JSON.parse(data));
           getBillingInfo(JSON.parse(data).id)
           getShippingOptions(JSON.parse(data).id);
        }
     }else{
        setIsLoggedIn(false);
        setLoading(false)
     }
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
      .finally(res => console.log() )
  }

  const getShippingOptions = async (user_id) => {
      var item_data = new Object();
      const promises = carts.map(async (item, index) => {
           var id = Math.random().toString(36).substring(1, 20);
           await fetch(`${live_url}product/find/${item.id}` )
             .then(response => response.json())
             .then(async(json) => {
               if(json.status == true ){
                 var new_item = {
                       "rowId": id,
                       "id": json.data.products.id,
                       "name": json.data.products.name,
                       "qty": item.qty,
                       "price": json.data.products.price,
                       "options": {
                         "shop_id": json.data.products.shop_id,
                         "weight": json.data.products.item_weight,
                         "category_id": json.data.products.category_id,
                         "attribute_key": "",
                         "attribute_value": ""
                       }
                     }
                 item_data[id] = new_item;
                 return item_data;
               }
             })
             .catch(error => console.error(error))
           })
      const is_done_data = await Promise.all(promises);
      if(is_done_data){
          setOrder(item_data);
          var shipping_data = {
            'user_id': user_id,
            'items': item_data,
          }
          setLoading(true);
          fetch(`${live_url}checkout/shipping` ,{
             method: 'POST',
             headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json'
             },
             body: JSON.stringify(shipping_data)
          })
           .then(response => response.json())
           .then(json => {
             if(json.status == true ){
                setShippingInfo(json.data);
                setLoading(false)
             }
           })
           .catch(error => console.error(error))
           .finally(() => console.log());
      }
  }

  const getBillingInfo = async (user_id) => {
    fetch(`${live_url}address/find/${user_id}` )
      .then(response => response.json())
      .then(async(json) => {
        console.log(json)
        if(json.status == true ){
            setBillingInfo({
                           id: json.data.id,
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
      .finally(res => console.log())
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
          <MaterialCommunityIcons name="menu" size={20} color="#4BA716" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Payment</Text> 
          <MaterialCommunityIcons name="cart-off" size={20} color="#4BA716" size={26} />
        </View>
        <ScrollView style={styles.body}>
            {
            isLoggedIn == true ?
                <>
                    <View style={styles.billingCon}>
                        <View style={{ alignSelf: 'center', width: '95%', flexDirection: 'row', justifyContent: 'space-between', }}>
                            <Text style={{ height: 50, fontSize: 15, color: '#000', fontFamily: 'Montserrat-Regular' }}>Shipping Information</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('BillingInfo')}  >
                                <Text style={{ height: 50, fontSize: 12, color: '#4BA716', fontFamily: 'Montserrat-Bold' }}>Update</Text>
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
                                <Collapse>
                                    <CollapseHeader>
                                        <Text style={[styles.itemTitle, {fontSize: 15, color: "#4BA716", fontFamily: 'Montserrat-Medium', }]} >Full Address</Text>
                                    </CollapseHeader>
                                    <CollapseBody>
                                      <DataTable.Row>
                                        <DataTable.Cell>
                                          <Text style={styles.itemTitle}>Suite No</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>
                                                { billingInfo.suite_no }
                                            </Text>
                                        </DataTable.Cell>
                                      </DataTable.Row>
                                      <DataTable.Row>
                                        <DataTable.Cell>
                                          <Text style={styles.itemTitle}>Town</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>
                                                { billingInfo.suburb_or_town }
                                            </Text>
                                        </DataTable.Cell>
                                      </DataTable.Row>
                                      <DataTable.Row>
                                        <DataTable.Cell>
                                          <Text style={styles.itemTitle}>State</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>
                                                { billingInfo.state_or_territory }
                                            </Text>
                                        </DataTable.Cell>
                                      </DataTable.Row>
                                      <DataTable.Row>
                                        <DataTable.Cell>
                                          <Text style={styles.itemTitle}>Country</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>
                                                { billingInfo.country }
                                            </Text>
                                        </DataTable.Cell>
                                      </DataTable.Row>
                                      <DataTable.Row>
                                        <DataTable.Cell>
                                          <Text style={styles.itemTitle}>Post Code</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>
                                                { billingInfo.post_code }
                                            </Text>
                                        </DataTable.Cell>
                                      </DataTable.Row>
                                      <View style={{ paddingTop: 20 }}>
                                        <Text style={[styles.itemTitle, {fontSize: 14, fontFamily: 'Montserrat-Bold', }]}>{ billingInfo.full_address }</Text>
                                      </View>
                                    </CollapseBody>
                                </Collapse>
                            </View>
                            :
                            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                                <Button mode="contained" color="#4BA716" style={styles.button} onPress={() => navigation.navigate('BillingInfo') } >
                                    Update Billing Info
                                </Button>
                            </View>
                        }
                    </View>
                    <View style={styles.cartCon}>
                        <DataTable>
                          <DataTable.Row>
                              <DataTable.Cell>
                                <Text>Order Summary</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>  </DataTable.Cell>
                          </DataTable.Row>
                          <DataTable.Row>
                              <DataTable.Cell>
                                <Text style={styles.itemTitle}>Sub Total</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>
                                <Text style={styles.itemTitle}>
                                    {'\u0024'}{ cartTotal.toFixed(2) }
                                 </Text>
                              </DataTable.Cell>
                          </DataTable.Row>

                          <DataTable.Row>
                              <DataTable.Cell>
                                <Text style={styles.itemTitle}>Tax</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>
                                 <Text style={styles.itemTitle}>
                                    {'\u0024'} { ((Number(fax)/ 100) * Number(cartTotal)).toFixed(2) }
                                 </Text>
                              </DataTable.Cell>
                          </DataTable.Row>

                          <DataTable.Row>
                              <DataTable.Cell>
                              <Text>Shipping Methods</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>  </DataTable.Cell>
                          </DataTable.Row>
                          {
                            shippingInfo &&
                            Object.keys(shippingInfo).map((item, index) => {
                                return (
                                      <DataTable.Row key={index}>
                                          <DataTable.Cell>
                                             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <RadioButton
                                                   value={selectedOption.value}
                                                   status={ selectedOption.value === shippingInfo[item].value ? 'checked' : 'unchecked' }
                                                   onPress={() => setSelectedOption(shippingInfo[item])}
                                                 />
                                                 <Text style={[styles.itemTitle, { fontSize: 13, left: 20 }]}>{ shippingInfo[item].value }</Text>
                                             </View>
                                          </DataTable.Cell>
                                          <DataTable.Cell numeric>
                                            <Text style={styles.itemTitle}>{'\u0024'} { shippingInfo[item].cost }</Text>
                                          </DataTable.Cell>
                                      </DataTable.Row>
                                )
                            })
                          }
                          <DataTable.Row>
                              <DataTable.Cell>
                                <Text style={[styles.itemTitle, { color: '#4BA716', fontFamily: 'Montserrat-Bold' }]}>Total Payable</Text>
                              </DataTable.Cell>
                              <DataTable.Cell numeric>
                                <Text style={{ color: '#4BA716', fontFamily: 'Montserrat-Bold' }}>{'\u0024'}{ ( ( selectedOption.cost ? selectedOption.cost : 0 ) +  cartTotal + ((Number(fax)/ 100) * Number(cartTotal))).toFixed(3) }</Text>
                              </DataTable.Cell>
                          </DataTable.Row>
                        </DataTable>
                    </View>
                    <View style={{ width: '95%', alignSelf: 'center', marginVertical: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <TouchableOpacity
                                           disabled={ !selectedOption.cost || billingInfo.phone === '' ||
                                                                                             billingInfo.email === '' ||
                                                                                             billingInfo.suburb_or_town === '' ||
                                                                                             billingInfo.state_or_territory === '' ||
                                                                                             billingInfo.post_code === '' ||
                                                                                             billingInfo.full_address === '' ||
                                                                                             billingInfo.suite_no === '' }
                                           style={[styles.button, { width: '45%' }]}
                                           onPress={() =>  navigation.navigate('makeCardPayment', {
                                                                                                totalPayment: ( selectedOption.cost ? selectedOption.cost : 0 ) +  cartTotal + ((Number(fax)/ 100) * Number(cartTotal)),
                                                                                                carts: carts,
                                                                                                fax:fax,
                                                                                                orders: orders,
                                                                                                sub_total: cartTotal,
                                                                                                shipping_fee: shippingInfo,
                                                                                                billingInfo: billingInfo.id,
                                                                                                selectedOption: selectedOption
                                                                                              })} >
                            <Text style={styles.buttonText}>Card Payment</Text>
                       </TouchableOpacity>
                       <TouchableOpacity disabled={ !selectedOption.cost ||  billingInfo.phone === '' ||
                                                                                           billingInfo.email === '' ||
                                                                                           billingInfo.suburb_or_town === '' ||
                                                                                           billingInfo.state_or_territory === '' ||
                                                                                           billingInfo.post_code === '' ||
                                                                                           billingInfo.full_address === '' ||
                                                                                           billingInfo.suite_no === '' }
                                     style={[styles.button, { width: '45%', backgroundColor: '#000' }]}  onPress={() =>  navigation.navigate('GooglePayment', {
                                                                                                                                      totalPayment: ( selectedOption.cost ? selectedOption.cost : 0 ) +  cartTotal + ((Number(fax)/ 100) * Number(cartTotal)),
                                                                                                                                      carts: carts,
                                                                                                                                      fax:fax,
                                                                                                                                      orders: orders,
                                                                                                                                      sub_total: cartTotal,
                                                                                                                                      shipping_fee: shippingInfo,
                                                                                                                                      billingInfo: billingInfo.id,
                                                                                                                                      selectedOption: selectedOption
                                                                                                                                    })} >
                          <ImageBackground source={require('../assets/gpay.png')} resizeMode='contain' style={{ width: '90%', height: '90%' }} />
                       </TouchableOpacity>
                    </View>
                </>
            :
            <>
                <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login') }  >
                      <Text style={styles.buttonText}>Login before checkout</Text>
                   </TouchableOpacity>
                </View>
            </>
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
    marginTop: 10,
  },
  itemTitle:{
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#000'
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
  button:{
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BA716',
    borderRadius: 10,
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'capitalize',
    color: '#fff'
  },
  billingCon:{
    width,
    padding: 20,
  }
});
