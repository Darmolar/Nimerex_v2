import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, Snackbar  } from 'react-native-paper';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';  
import { GooglePay } from 'react-native-google-pay';

const { width, height } = Dimensions.get('window');
const allowedCardNetworks = ['VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

const requestData = {
  cardPaymentMethod: {
    tokenizationSpecification: {
      type: 'PAYMENT_GATEWAY',
      // stripe (see Example):
      gateway: 'stripe',
      gatewayMerchantId: '',
      stripe: {
        publishableKey: 'pk_test_51HFTeDDTsjZr0XgPcARyAbLibQ5YO0VObZPwfuMP4k2h70WXr3Fe0wGgjVF3bOTl4keMbJhohgWfQYTU9UKnPMRr00G1kf3rFY',
        version: '2018-11-08',
      },
      // other:
      gateway: 'example',
      gatewayMerchantId: 'exampleGatewayMerchantId',
    },
    allowedCardNetworks,
    allowedCardAuthMethods,
  },
  transaction: {
    totalPrice: '30',
    totalPriceStatus: 'FINAL',
    currencyCode: 'USD',
  },
  merchantName: 'Nimarex',
};

// Set the environment before the payment request
GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

export default function makePayment(){
    const [ email, setEmail ] = useState('');
    const [ userDetails, setUserDetails ] = useState({
                                                    first_name: '',
                                                    last_name: '',
                                                    email: '',
                                                    password: '',
                                                    dob: '',
                                                    country: '',
                                                });
    const [ visible, setVisible ] = React.useState(false);
    const [ message, setMessage ] = useState('');
    const [ submitting, setSubmitting ] = useState(false);
    const [ canUse, setCanUse ] = useState(false);

    const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

    useEffect(()=>{
       makePayment();
    },[])

    const makePayment = async () => {
        // Check if Google Pay is available
        GooglePay.isReadyToPay(allowedCardNetworks, allowedCardAuthMethods)
          .then((ready) => {
            if (ready) {
            console.log("Can use adroid pay");
              // Request payment token
              GooglePay.requestPayment(requestData)
                .then((token: string) => {
                  // Send a token to your payment gateway
                  console.log(token);
                })
                .catch((error) => console.log(error.code, error.message));
            }else{
                console.log("Cannot use adroid pay");
            }
        })
      }

    return (
        <View style={styles.container}>
           <Text>Testing google pay</Text>
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
