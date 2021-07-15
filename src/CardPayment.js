
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import base64 from 'react-native-base64'
import { Button, TextInput, Snackbar, Switch  } from 'react-native-paper';
import { live_url, payment_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window');

export default function makeCardPaymentScreen({ navigation, route }){
    const { totalPayment, carts, fax } = route.params;
    const [ userDetails, setUserDetails ] = useState({
                                                    firstname: '',
                                                    lastname: '',
                                                    email: '',
                                                    password: '',
                                                    dob: '',
                                                    country: '',
                                                    telephone: '',
                                                });
    const [ visible, setVisible ] = React.useState(false);
    const [ message, setMessage ] = useState('');
    const [ submitting, setSubmitting ] = useState(false);
    const [ isSwitchOn, setIsSwitchOn ] = React.useState(false);
    const [ cardDetails, setCardDetails ] = useState({
                                                        card: '',
                                                        year: '',
                                                        month: '',
                                                        cvv: '',
                                                    });

    const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

    useEffect(()=>{
       getUserDetails();
    },[])

    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    const getUserDetails = async () => {
         let token = await SecureStore.getItemAsync('token');
         if(token !== null){
            let data = await SecureStore.getItemAsync('user_details');
            if(data !== null){
               var userDetail = JSON.parse(data);
               setUserDetails(userDetail);
            }
         }else{
             navigation.navigate('Login')
         }
       }

    const proceedToPay = async () => {
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
       var ref = 23456789876543;
       new_data.append('email', userDetails.email);
       new_data.append('amount', totalPayment.toFixed(2));
       new_data.append('user_id', userDetails.id);
       new_data.append('card', parseInt(cardDetails.card));
       new_data.append('year', parseInt(cardDetails.year));
       new_data.append('month', parseInt(cardDetails.month));
       new_data.append('cvv', parseInt(cardDetails.cvv));
       new_data.append('ref', ref);
       new_data.append('save_card', isSwitchOn);
       new_data.append('sandbox', true);
       fetch(`${payment_url}rest/Authorize_Net/chargeCreditCard`,{
             method: 'POST',
             headers: {
               Accept: 'application/json',
               'Content-Type': 'multipart/form-data'
             },
             body: new_data
           })
       .then(response => response.json())
       .then(async(json) => {
         console.log(json);
          if(json.success == true){
            setMessage(json.result.description);
            setVisible(true)
          }else{
            setMessage(json.errors.error_message);
            setVisible(true)
          }
       })
       .catch(error => console.error(error))
       .finally(res => setSubmitting(false))
    }

    return (
        <View style={styles.container}>
          <View style={styles.body}>
            <View style={styles.formGroup}>
             <TextInput
               label="Email"
               style={{ height: 50, fontSize: 12 }}
               value={userDetails.email}
               editable={false}
             />
           </View>
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
           <Text style={{ width: 150, fontFamily: 'Montserrat-Medium', fontSize: 14, justifyContent: 'center', alignSelf: 'flex-end'   }}>
               <Switch color="#b22234" value={isSwitchOn} onValueChange={onToggleSwitch} />
                Save Card
           </Text>

            <View style={{ width: '100%', marginTop: 20 }}>
                <Button loading={submitting} mode="contained" color="#b22234" style={styles.button}  onPress={() => proceedToPay() } >
                    Confirm Payment
                </Button>
            </View>

          </View>
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
  head:{
    width,
    flex: 1.5,
    padding: 20,
    justifyContent: 'center',
  },
  body:{
    width,
    padding: 20,
  },
  conList:{
    width,
    padding: 10,
    marginTop: 20,
  },
  formGroup:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20
  },
  input:{
    width: '100%',
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#000',
    left: 10
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
});