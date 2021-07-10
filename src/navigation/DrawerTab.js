import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';

import { createDrawerNavigator } from '@react-navigation/drawer';

import TabContent from './TabContent';
const Drawer = createDrawerNavigator();

import MyStack from './Stack';

export default function MyDrawer() {
  return (
    <Drawer.Navigator     
            overlayColor="transparent"
            drawerContent={props => <TabContent {...props} />} 
        >
        <Drawer.Screen name="MyStack" component={MyStack} /> 
    </Drawer.Navigator>
  );
}