import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, FAB  } from 'react-native-paper'; 
 
const { width, height } = Dimensions.get('window'); 

export default function ContactScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#4BA716" onPress={() => navigation.goBack() }   />
          <Text style={styles.headerText}>Contact</Text> 
          <View></View>
        </View>
        <View style={styles.body}> 
          <ScrollView style={styles.conList}>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Name"  
                style={{ height: 50, fontSize: 12 }}
              />
            </View>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Email"  
                style={{ height: 50, fontSize: 12 }}
              />
            </View>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Message"  
                multiline={true}
                style={{ height: 100, fontSize: 12 }}
              />
            </View> 
            
            <View style={{ width: '100%', marginTop: 20 }}>                  
                <Button mode="contained" color="#4BA716" style={styles.button}  onPress={() => navigation.navigate('DashboardTabs', { screen: 'Home' })} >
                    Send Direct message
                </Button>
            </View>
          </ScrollView>
        </View>

        <FAB
            style={styles.fab}
            small
            icon="chat"
            onPress={() => console.log('Pressed')}
        />
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4BA716',
    color: '#fff',
    width: 40,
    height: 40,
  },
});
