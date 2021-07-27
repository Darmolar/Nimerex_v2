import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import base64 from 'react-native-base64'
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { live_url, payment_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const PaymentRequest = require('react-native-payments').PaymentRequest;

const METHOD_DATA = [{
  supportedMethods: ['apple-pay'],
  data: {
    merchantIdentifier: 'merchant.apple.test',
    supportedNetworks: ['visa', 'mastercard', 'amex'],
    countryCode: 'US',
    currencyCode: 'USD'
  }
}];

const DETAILS = {
  id: 'basic-example',
  displayItems: [
    {
      label: 'Movie Ticket',
      amount: { currency: 'USD', value: '15.00' }
    },
    {
      label: 'Grocery',
      amount: { currency: 'USD', value: '5.00' }
    }
  ],
  shippingOptions: [{
    id: 'economy',
    label: 'Economy Shipping',
    amount: { currency: 'USD', value: '0.00' },
    detail: 'Arrives in 3-5 days' // `detail` is specific to React Native Payments
  }],
  total: {
    label: 'Enappd Store',
    amount: { currency: 'USD', value: '20.00' }
  }
};
const OPTIONS = {
  requestPayerName: true,
  requestPayerPhone: true,
  requestPayerEmail: true,
};

const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS, OPTIONS);

paymentRequest.addEventListener('shippingaddresschange', e => {
  const updatedDetails = getUpdatedDetailsForShippingAddress(paymentRequest.shippingAddress);

  e.updateWith(updatedDetails);
});

paymentRequest.addEventListener('shippingoptionchange', e => {
  const updatedDetails = getUpdatedDetailsForShippingOption(paymentRequest.shippingOption);

  e.updateWith(updatedDetails);
});

export default function ApplePaymentScreen({ navigation, route }){
    const [ email, setEmail ] = useState('');
    const { totalPayment, carts, fax, shipping_fee, sub_total, orders, billingInfo, selectedOption } = route.params;
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
    const [ canUse, setCanUse ] = useState(true);
    const [ cartItem, setItem ] = useState(orders);
    const [ order_items, setOrder_items ] = useState({});

    const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

    useEffect(()=>{
       check();
       setSubmitting(true);
       getUserDetails();
       formatCartItem()
    },[])

    check = () => {
      paymentRequest.canMakePayments().then((canMakePayment) => {
        if (canMakePayment) {
          Alert.alert(
            'Apple Pay',
            'Apple Pay is available in this device'
          );
        }else{
            Alert.alert(
                'Apple Pay',
                'Apple Pay is not available in this device'
              );
        }
      })
    }

    const formatCartItem = async () => {
        var new_item = new Object;
        for (const [key, value] of Object.entries(cartItem)) {
          var id = Math.random().toString(36).substring(1, 20);
          var data = {
                    "product_id": value.id,
                    "product_attribute_key": null,
                    "product_attribute": null,
                    "quantity": value.qty,
                    "cost": value.price,
                    "total": value.qty * value.price,
                    "weight": value.options.weight,
                  }
          order_items[key] = data;
          await setOrder_items(order_items)
        }
    }

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

    pay = () => {
    paymentRequest.canMakePayments().then((canMakePayment) => {
    if (canMakePayment) {
      console.log('Can Make Payment')
      paymentRequest.show()
        .then(paymentResponse => {
          // Your payment processing code goes here

          paymentResponse.complete('success');
        });
    }
    else {
      console.log('Cant Make Payment')
    }
  })
}

    return (
    <View style={styles.container}>
            {
                canUse &&
                <ActivityIndicator color="#000" size="large" />
            }
            <Snackbar
              visible={!canUse}
              onDismiss={() => navigation.goBack()}
              action={{
                label: 'Close',
                onPress: () => {
                    navigation.goBack();
                },
              }}>
              Cannot use google pay. Please use other payment option.
            </Snackbar>
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});