
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { GooglePay } from 'react-native-google-pay';
import base64 from 'react-native-base64'
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { live_url, payment_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window');
const allowedCardNetworks = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'INTERAC', 'JCB'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

// Set the environment before the payment request
GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

export default function GooglePaymentScreen({ navigation, route }){
    const [ email, setEmail ] = useState('');
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
    const [ canUse, setCanUse ] = useState(false);
    const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

    useEffect(()=>{
       setSubmitting(true);
       getUserDetails();
    },[])

    const getUserDetails = async () => {
     let token = await SecureStore.getItemAsync('token');
     if(token !== null){
        let data = await SecureStore.getItemAsync('user_details');
        if(data !== null){
           var userDetail = JSON.parse(data);
           setUserDetails(userDetail);
           makePayment(userDetail.id);
        }
     }else{
         navigation.navigate('Login')
     }
   }

    const requestData = {
      cardPaymentMethod: {
        tokenizationSpecification: {
          type: 'PAYMENT_GATEWAY',
          gateway: 'authorizenet',
          gatewayMerchantId: '743444',
        },
        allowedCardNetworks,
        allowedCardAuthMethods,
      },
      transaction: {
        totalPrice: totalPayment.toFixed(2),
        totalPriceStatus: 'FINAL',
        currencyCode: 'USD',
      },
    };

    const makePayment = async (user_id) => {
        // Check if Google Pay is available
        GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
          .then((ready) => {
            if (ready) {
              setSubmitting(true)
              console.log("Can use adnroid pay");
              // Request payment token
              GooglePay.requestPayment(requestData)
                .then((response) => {
                  // Send a token to your payment gateway
                  console.log('this is the response', response);
                  var paymentDatas = base64.encode(response);
                  var new_payment_data = new FormData;
                  new_payment_data.append('amount', totalPayment.toFixed(2));
                  new_payment_data.append('user_id', user_id);
                  new_payment_data.append('descriptor', 'COMMON.GOOGLE.INAPP.PAYMENT');
                  new_payment_data.append('payment_token', paymentDatas);
                  new_payment_data.append('sandbox', true);
                  console.log(new_payment_data);
                  console.log('Payment Data', requestData)
                  setSubmitting(true);
                    fetch(`${payment_url}rest/Authorize_Net/verifyMobilePayment`,{
                     method: 'POST',
                     headers: {
                       Accept: 'application/json',
                       'Content-Type': 'multipart/form-data'
                     },
                     body: new_payment_data
                    } )
                      .then(response => response.json())
                      .then((json) => {
                        console.log(json);
                        if(json.success == true ){
                          // console.log(json.data);
                          setAllProducts(json.data);
                        }else{
                           setMessage(json.errors.error_message);
                           setVisible(true);
                        }
                      })
                      .catch(error => console.error(error))
                      .finally(res => setSubmitting(false))
                })
                .catch((error) => console.log(error.code, error.message))
                .finally(() => setSubmitting(false) );
            }else{
              setSubmitting(false);
              console.log("Cannot use android pay");
            }
        })
      }

    return (
        <View style={styles.container}>
            {
                 submitting == true
                ?
                <ActivityIndicator color="#000" size="small" />
                :
                <Text>Cannot use google pay </Text>
            }
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
    flex: 2.5,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText:{
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
    top: '5%'
  },
  headerTexth2:{
    fontSize: 20,
    fontFamily: 'Montserrat-Regular',
    top: '10%'
  },
  formBox:{
    width: '100%',
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
  }
});