
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import base64 from 'react-native-base64'
import { Button, TextInput, Snackbar, Switch  } from 'react-native-paper';
import { live_url, payment_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window');

export default function ResponseScreen({ navigation, route }){
    const { response } = route.params;
    useEffect(() => {
        emptyCart()
    },[])

    const emptyCart = async () => {
        await SecureStore.deleteItemAsync('cart_item_item');
    }

    return (
        <View style={styles.container}>
            <Image source={require('../assets/success.jpg')} style={{ width: 300, height: 300, }} />
            <Text style={{ marginTop: 20, fontSize: 20, fontFamily: 'Montserrat-Light', color: '#000' }} >{ response.message }</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DashboardTabs', { screen: 'Home' }) }  >
                <Text style={styles.buttonText}>Proceed</Text>
             </TouchableOpacity>
        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button:{
    width: '80%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BA716',
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'capitalize',
    color: '#fff'
  }
});