import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, Snackbar, RadioButton, Switch  } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window'); 

export default function SubscriptionCartScreen({ navigation, route }) {
     const [ loading, setLoading ] = useState(true);
     const [ isLoggedIn, setIsLoggedIn ] = useState(false);
     const [ userDetails, setUserDetails ] = useState({});
     const [ isSwitchOn, setIsSwitchOn ] = React.useState(false);
     const [ message, setMessage ] = useState('');
     const [ visible, setVisible ] = React.useState(false);
     const [ subProducts, setSubProducts ] = useState([]);
     const [ usePaymentMode, setPaymentMode ] = useState('card');
     const [ cardDetails, setCardDetails ] = useState({
                                                        card: '',
                                                        year: '',
                                                        month: '',
                                                        cvv: '',
                                                    });
     const [ submitting, setSubmitting ] = useState(false);
     const sub_details = route.params.item;

     const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

     useEffect(() => {
       setLoading(true);
       getUserDetails();
     },[navigation]);

     const getUserDetails = async () => {
        let token = await SecureStore.getItemAsync('token');
        if(token !== null){
           setIsLoggedIn(true);
           let data = await SecureStore.getItemAsync('user_details');
           if(data !== null){
              setUserDetails(JSON.parse(data));
              getMySubsProducts(JSON.parse(data).id);
           }
        }else{
           setIsLoggedIn(false)
        }
      }
     const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

     const getMySubsProducts = async (user_id) => {
         setLoading(true);
         fetch(`${live_url}subscription/product/${sub_details.id}/${user_id}` )
           .then(response => response.json())
           .then(async(json) => {
             if(json['status'] == true  ){
               setSubProducts(json.data['data']);
             }else{
               setSubProducts([]);
             }
           })
           .catch(error => console.error(error))
           .finally(res => setLoading(false))
     }

     const payWithNewCard = async () => {
        if(cardDetails.card == '' ||
             cardDetails.year == '' ||
             cardDetails.month == '' ||
             cardDetails.cvv == '' ){
             setMessage('All fields are required');
             setVisible(true);
             return false;
        }
       setSubmitting(true);
       var new_data = new FormData;
       new_data.append('email', userDetails.email);
       new_data.append('user_id', userDetails.id);
       new_data.append('number', parseInt(cardDetails.card));
       new_data.append('expiry_year', (cardDetails.year));
       new_data.append('expiry_month', (cardDetails.month));
       new_data.append('cvv2', parseInt(cardDetails.cvv));
       new_data.append('subscription_id', sub_details.id);
       new_data.append('sandbox', true);
        console.log(new_data)
       fetch(`${live_url}subscription/card/authorize`,{
             method: 'POST',
             headers: {
               Accept: 'application/json',
               'Content-Type': 'multipart/form-data'
             },
             body: new_data
           })
       .then(response => response.json())
       .then(async(json) => {
          if(json.success == true){
            navigation.navigate('Response', { response: json })
          }else{
            setMessage(json.message);
            setVisible(true)
          }
       })
       .catch(error => console.error(error))
       .finally(res => setSubmitting(false))
     }

     const payWithSavedCard = async () => {
        setSubmitting(true);
        var new_data = new FormData;
        new_data.append('email', userDetails.email);
        new_data.append('user_id', userDetails.id);
        new_data.append('subscription_id', sub_details.id);
         console.log(new_data)
        fetch(`${live_url}subscription/authorize`,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
              },
              body: new_data
            })
        .then(response => response.json())
        .then(async(json) => {
           if(json.status == true){
             navigation.navigate('Response', { response: json })
           }else{
             setMessage(json.message);
             setVisible(true)
           }
        })
        .catch(error => console.error(error))
        .finally(res => setSubmitting(false))
     }

     const removeItem = async (item) => {
        setLoading(true);
        var new_data = new FormData;
        new_data.append('product_id', item.id);
        new_data.append('user_id', userDetails.id);
        new_data.append('subscription_id', sub_details.id);
         console.log(new_data)
        fetch(`${live_url}subscription/product/remove`,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
              },
              body: new_data
            })
        .then(response => response.json())
        .then(async(json) => {
           if(json.status == true){
             setMessage(json.message);
             setVisible(true);
             getUserDetails();
           }else{
             setMessage(json.message);
             setVisible(true);
             setLoading(false)
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
                  <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
                  <Text style={styles.headerText}>SubScription Cart</Text>
                  <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} />
                </View>
                <ScrollView style={styles.body}>
                    <View style={styles.cartCon}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Item</DataTable.Title>
                                <DataTable.Title >Price</DataTable.Title>
                                <DataTable.Title >Quantity</DataTable.Title>
                                <DataTable.Title numeric>Action</DataTable.Title>
                            </DataTable.Header>
                            {
                            Object.keys(subProducts).map((product, index) => {
                                if( product == "subscription_card_details"  ){
                                    return null;
                                }
                                var item = subProducts[product];
                                    return(
                                        <DataTable.Row key={index}>
                                           <DataTable.Cell>
                                            <Text style={styles.itemTitle}>{ item.name } </Text>
                                           </DataTable.Cell>
                                           <DataTable.Cell >{'\u0024'} { item.price } </DataTable.Cell>
                                           <DataTable.Cell>
                                           <View style={styles.quantityCon}>
                                               <View style={styles.quantityConMiddle}>
                                                   <NewTextInput
                                                       value="0"
                                                       keyboardType="number-pad"
                                                       style={styles.quantityConMiddleInput}
                                                       value={item.subscription_products_quantity }
                                                       editable={false}
                                                   />
                                               </View>
                                           </View>
                                           </DataTable.Cell>
                                           <DataTable.Cell numeric>
                                               <Button mode="text" labelStyle={{ fontFamily: 'Montserrat-Medium', }} onPress={() =>  removeItem(item)} style={styles.closeButton}>
                                                   <MaterialCommunityIcons name="close" size={18} color="red" />
                                               </Button>
                                           </DataTable.Cell>
                                       </DataTable.Row>
                                    )
                                })
                            }
                        </DataTable>
                        <View style={{ padding: 10, width: '100%' }}>
                            <View style={{ width: '100%' }}>
                                 <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                  <RadioButton
                                      value="card"
                                      color="#b22234"
                                      status={ usePaymentMode === 'card' ? 'checked' : 'unchecked' }
                                      onPress={() => setPaymentMode('card') }
                                    />
                                  <Text style={[styles.headerText, { fontSize: 15, left: 10, fontFamily: 'Montserrat-Medium',  }]}> Saved Card(s)</Text>
                                 </View>
                                 {
                                     (usePaymentMode == 'card' && loading == false) &&
                                     <View style={{ width: '80%', marginTop: 10, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
                                        <Text style={[styles.headerText, { fontSize: 12, left: 10, fontFamily: 'Montserrat-Medium', }]}>
                                            {  subProducts["subscription_card_details"]["result"] ? subProducts["subscription_card_details"]["result"]['card'] : null }
                                        </Text>
                                     </View>
                                 }
                                 <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                   <RadioButton
                                       value="card_new"
                                       color="#b22234"
                                       status={ usePaymentMode === 'card_new' ? 'checked' : 'unchecked' }
                                       onPress={() => setPaymentMode('card_new') }
                                     />
                                   <Text style={[styles.headerText, { fontSize: 15, left: 10, fontFamily: 'Montserrat-Medium',  }]}> New Card</Text>
                                 </View>
                                 {
                                    usePaymentMode == 'card_new' &&
                                    <View style={{  width: '95%', marginTop: 20, alignSelf: 'flex-end'}}>
                                        <View style={styles.formGroup}>
                                          <TextInput
                                            label="Card Number"
                                             keyboardType="number-pad"
                                             style={{ height: 50, fontSize: 12 }}
                                             value={cardDetails.card}
                                             onChangeText={val => setCardDetails({ ...cardDetails, card: val }) }
                                          />
                                       </View>
                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
                                           <View style={[styles.formGroup, { width: '30%' }]}>
                                              <TextInput
                                                label="Expire Month"
                                                keyboardType="number-pad"
                                                style={{ height: 50, fontSize: 12 }}
                                                value={cardDetails.month}
                                                 maxLength={2}
                                                onChangeText={val => setCardDetails({ ...cardDetails, month: val }) }
                                              />
                                           </View>
                                           <View style={[styles.formGroup, { width: '30%' }]}>
                                              <TextInput
                                                label="Expire Year"
                                                keyboardType="number-pad"
                                                style={{ height: 50, fontSize: 12 }}
                                                 value={cardDetails.year}
                                                 maxLength={4}
                                                 onChangeText={val => setCardDetails({ ...cardDetails, year: val }) }
                                              />
                                           </View>
                                           <View style={[styles.formGroup, { width: '20%' }]}>
                                              <TextInput
                                                label="CVV"
                                                style={{ height: 50, fontSize: 12 }}
                                                 value={cardDetails.cvv}
                                                 maxLength={3}
                                                 onChangeText={val => setCardDetails({ ...cardDetails, cvv: val }) }
                                              />
                                           </View>
                                       </View>
                                    </View>
                                 }
                            </View>
                        </View>
                    </View>


                    <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                        <Button loading={submitting} mode="contained" color="#b22234" style={styles.button}  onPress={() => usePaymentMode == 'card' ? payWithSavedCard()  :  payWithNewCard()  } >
                            Authorize
                        </Button>
                    </View>
                </ScrollView>
                <Snackbar
                  visible={visible}
                  onDismiss={onDismissSnackBar}
                  action={{
                    label: 'Close',
                    onPress: () => {
                      setMessage('');
                      setVisible(false);
                    },
                  }}>
                  { message }
                </Snackbar>
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
    fontFamily: 'Montserrat-Regular',
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
  },
  formGroup:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginVertical: 20
  },
});
