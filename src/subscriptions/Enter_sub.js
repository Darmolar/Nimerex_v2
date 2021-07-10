import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window'); 

export default function EditSubscriptionScreen({ navigation }) { 
 
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Edit SubScription</Text> 
          {/* <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} /> */}
          <View></View>
        </View>
        <View style={styles.body}>
            <ScrollView style={styles.cartCon}> 
                <View style={{ padding: 10, width: '100%' }}>
                    <View style={styles.formGroup}>  
                        <TextInput
                            mode="outlined"
                            label="Name"  
                            style={{ height: 50, fontSize: 12,  }}  
                        />
                    </View>
                    <View style={styles.formGroup}> 
                        <TextInput
                            mode="outlined"
                            label="Frequency"  
                            style={{ height: 50, fontSize: 12,  }} 
                            right={  <TextInput.Icon name="arrow-down" size={20} color="#b22234" />}
                        />
                    </View>  
                </View>
            </ScrollView> 
            
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>                  
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('SubscriptionCart')} >
                    Submit
                </Button>
            </View>
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
  cartCon:{
    padding: 10
  },  
  formGroup:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20
  },
});
