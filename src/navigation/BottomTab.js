import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

const Tab = createMaterialBottomTabNavigator();

import HomeScreen from '../Home';
import SearchScreen from '../Search';
import CartScreen from '../Cart';
import ProfileScreen from '../Profile';

export default function DashboardTabs() {
  return (
    <Tab.Navigator
        initialRouteName="Home"
        activeColor="#b22234"
        inactiveColor="#000"
        barStyle={{ backgroundColor: '#fff', paddingBottom: 5 }}
    >
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="home" color={focused ? "#b22234" : '#000'} size={26} />
            ),
          }}
        /> 
      <Tab.Screen name="Search" component={SearchScreen} 
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => ( 
              <Feather name="search" size={24} color={focused ? "#b22234" : '#000'} size={26}/>
            ),
          }}
      /> 
      <Tab.Screen name="Cart" component={CartScreen} 
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="cart-outline" color={focused ? "#b22234" : '#000'} size={26} />
            ),
          }}
      /> 
      <Tab.Screen name="Profile" component={ProfileScreen} 
        options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons name="account" color={focused ? "#b22234" : '#000'} size={26} />
            ),
          }}
      />       
    </Tab.Navigator>
  );
}