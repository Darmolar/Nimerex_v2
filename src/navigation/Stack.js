import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import LoginScreen from '../auth/Login';
import ResetScreen from '../auth/Reset';
import Forget_PasswordScreen from '../auth/Forget_password';
import RegisterScreen from '../auth/Register';

import IndexScreen from '../Index'; 
import DashboardTabs from './BottomTab'; 

import SavedScreen from '../Saved';

import PaymentScreen from '../Payment';
 
import ContactScreen from '../Contact';

import CategoryScreen from '../Category';
import ProductScreen from '../Product';
//Profile Tabs
import EditProfileScreen from '../profile/edit_profile';
import BillingInfoScreen from '../profile/billing_info';
import SecurityScreen from '../profile/security';

//Subscription Screen
import SubscriptionScreen from '../subscriptions/Index';
import SubscriptionProductsScreen from '../subscriptions/products';
import SubscriptionCartScreen from '../subscriptions/Sub_cart';
import EditSubscriptionScreen from '../subscriptions/Enter_sub';
import EditNewSubscriptionScreen from '../subscriptions/Edit_sub';

//Gift Screen
import GiftScreen from '../gift/Index';
import SendGiftScreen from '../gift/Send_gift';

//Response Screen
import ResponseScreen from '../Response';

//Payments
import GooglePaymentScreen from '../GooglePay';
import makeCardPaymentScreen from '../CardPayment';

export default function MyStack() {

  return (
    <Stack.Navigator initialRouteName="DashboardTabs" >
      <Stack.Screen name="Index" component={IndexScreen} options={{headerShown: false}} /> 

      <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
      <Stack.Screen name="Forget_Password" component={Forget_PasswordScreen} options={{headerShown: false}} />
      <Stack.Screen name="Reset" component={ResetScreen} options={{headerShown: false}} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}} /> 

      <Stack.Screen name="DashboardTabs" component={DashboardTabs} options={{headerShown: false}} />
      
      <Stack.Screen name="Product" component={ProductScreen} options={{headerShown: false}} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{headerShown: false}} />
      
      <Stack.Screen name="Payment" component={PaymentScreen} options={{headerShown: false}} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown: false}} />
      <Stack.Screen name="BillingInfo" component={BillingInfoScreen} options={{headerShown: false}} />
      <Stack.Screen name="Security" component={SecurityScreen} options={{headerShown: false}} />
 
      <Stack.Screen name="Saved" component={SavedScreen} options={{headerShown: false}} />
      <Stack.Screen name="Contact" component={ContactScreen} options={{headerShown: false}} />

      <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{headerShown: false}} />
      <Stack.Screen name="SubscriptionProducts" component={SubscriptionProductsScreen} options={{headerShown: false}} />
      <Stack.Screen name="SubscriptionCart" component={SubscriptionCartScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditSubscription" component={EditSubscriptionScreen} options={{headerShown: false}} />
      <Stack.Screen name="EditNewSubscription" component={EditNewSubscriptionScreen} options={{headerShown: false}} />

      <Stack.Screen name="GooglePayment" component={GooglePaymentScreen}  />
      <Stack.Screen name="makeCardPayment" component={makeCardPaymentScreen}  options={{title: 'Card Payment'}} />

      <Stack.Screen name="Gift" component={GiftScreen} options={{headerShown: false}} />       
      <Stack.Screen name="SendGift" component={SendGiftScreen} options={{headerShown: false}} />


      <Stack.Screen name="Response" component={ResponseScreen} options={{headerShown: false}} />

    </Stack.Navigator>
  );
}