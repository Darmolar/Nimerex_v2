import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import {
        createDrawerNavigator,
        DrawerContentScrollView,
        DrawerItemList,
        DrawerItem,
    } from '@react-navigation/drawer';
import Icon from '@expo/vector-icons/Ionicons'; 
import { Button, TextInput, DataTable  } from 'react-native-paper';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window');

function TabContent(props) {
    const [ userDetails, setUserDetails ] = useState({});

    useEffect(() => {
        getUserDetails();
    },[props.navigation]);

    const getUserDetails = async () => {
         let token = await SecureStore.getItemAsync('token');
         if(token !== null){
            let data = await SecureStore.getItemAsync('user_details');
            if(data !== null){
               setUserDetails(JSON.parse(data));
            }
         }
    }

    const logout = async () => {
         await SecureStore.deleteItemAsync('token');
         await SecureStore.deleteItemAsync('user_details');
         props.navigation.navigate('Login')
    }

    return (
      <DrawerContentScrollView {...props}> 
        <View style={{ width, alignItems: 'flex-end', padding: 20 }}>
            <Icon name="close-sharp" size={20} color="black" onPress={() => props.navigation.toggleDrawer() } />
        </View>
        <View style={{ width, flexDirection: 'row',  alignItems: 'center', padding: 20 }}>
            <Image 
                source={{ uri: 'https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png' }} 
                style={{ width: 30, height: 30 }}
                borderRadius={30}
            />
            <Text style={{ left: 10, color: '#4BA716', fontSize: 10, fontFamily: 'Montserrat-Bold' }}>{ userDetails.username }</Text>
        </View> 
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('DashboardTabs', { screen: 'Home' }) }>
            <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Saved') }>
            <Text style={styles.buttonText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Gift') } >
            <Text style={styles.buttonText}>Free Gift</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Subscription') } >
            <Text style={styles.buttonText}>Subscription</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate('Contact') } >
            <Text style={styles.buttonText}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Help</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>FaQ’s</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Terms & conditions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logOutButton}  onPress={() => logout()} >
          <Text style={styles.logOutButtonbuttonText}>Logout</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
    );
  }

export default TabContent;

const styles = StyleSheet.create({
    button:{
        width,
        height: 40,
        justifyContent: 'center',
    },
    buttonText:{ 
        color: '#000',
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        fontWeight: '100',
        left: 20
    },
      logOutButton:{
        width: '80%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4BA716',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 30,
      },
      logOutButtonbuttonText:{
        fontSize: 12,
        fontFamily: 'Montserrat-Medium',
        textTransform: 'capitalize',
        color: '#fff'
      }
});