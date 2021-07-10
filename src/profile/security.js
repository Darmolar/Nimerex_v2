import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window'); 

export default function SecurityScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#b22234" onPress={() => navigation.goBack() }   />
          <Text style={styles.headerText}>Security</Text> 
          <View></View>
        </View>
        <View style={styles.body}> 
          <ScrollView style={styles.conList}>
            <View style={styles.formGroup}> 
              <TextInput 
                label="New Password"  
                style={{ height: 50, fontSize: 12 }}
              />
            </View>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Confirm Password"  
                style={{ height: 50, fontSize: 12 }}
              />
            </View> 
            
            <View style={{ width: '100%' }}>  
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('DashboardTabs', { screen: 'Home' })} >
                    Update
                </Button>
            </View>
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
  } 
});
