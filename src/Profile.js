import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window'); 

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Profile</Text> 
          <MaterialCommunityIcons name="logout" size={20} color="#b22234" size={26} />
        </View>
        <View style={styles.body}>
          <View style={styles.profileCon}>
            <ImageBackground source={require('../assets/img_avatar.png')} borderRadius={130} style={styles.profilePictureCon}>

                <View style={styles.cameraCon}>
                  <MaterialCommunityIcons name="camera-plus-outline" size={20} color="#b22234" />
                </View>
            </ImageBackground>
            <Text  style={styles.profileName}>John Doe</Text>
          </View>
          <ScrollView style={styles.conList}> 
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfile') } >
                <Text style={styles.actionButtonText}>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('BillingInfo') } >
                <Text style={styles.actionButtonText}>Billing Information</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Security') } >
                <Text style={styles.actionButtonText}>Security Setting</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Gift') } >
                <Text style={styles.actionButtonText}>Free Gift</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Subscription') } >
                <Text style={styles.actionButtonText}>My Subscription</Text>
            </TouchableOpacity> 
            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Referrer</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
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
    fontFamily: 'Montserrat-Bold', 
    color: '#000',
  },
  body:{
    width
  },
  profileCon:{
    width,
    height: 200, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureCon:{
    width: 130,
    height: 130,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderWidth: .6,
    borderRadius: 130,
    borderColor: '#b22234'
  },
  profileName:{
    fontSize: 18,
    fontFamily: 'Montserrat-Bold', 
    color: '#000',
    top: 10
  },
  cameraCon:{
    width: 30, 
    height: 30, 
    borderRadius: 30,
    borderWidth: .6,
    borderColor: '#b22234',
    justifyContent: 'center',
    alignItems: 'center',
    right: '7%',
    bottom: '7%',
    backgroundColor: '#fff',
  },
  conList:{
    width,
    padding: 10, 
  },
  actionButton:{
    width: '100%',
    height: 35,
    borderBottomWidth: .4,
    borderColor: '#b22234',
    justifyContent: 'center',
    padding: 10,
    marginVertical: 10
  },
  actionButtonText:{
    fontSize: 15,
    fontFamily: 'Montserrat-Regular', 
    color: '#000',
  }
});
