import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable  } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window'); 

export default function SubscriptionCartScreen({ navigation }) { 
 
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>SubScription Cart</Text> 
          <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} />
        </View>
        <View style={styles.body}>
            <ScrollView style={styles.cartCon}>
                <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Item</DataTable.Title>
                    <DataTable.Title >Price</DataTable.Title>
                    <DataTable.Title >Quantitiy</DataTable.Title>
                    <DataTable.Title numeric>Action</DataTable.Title>
                </DataTable.Header>
                <DataTable.Row>
                    <DataTable.Cell>
                    <Text style={styles.itemTitle}>Frozen yogurt</Text>
                    </DataTable.Cell>
                    <DataTable.Cell >{'\u0024'}3,000</DataTable.Cell>
                    <DataTable.Cell>
                    <View style={styles.quantityCon}>
                        <View style={styles.quantityConLeft}>
                        <TouchableOpacity style={styles.quantityButton}>
                            <MaterialCommunityIcons name="minus" size={20} color="red" />
                        </TouchableOpacity>
                        </View>
                        <View style={styles.quantityConMiddle}>
                        <NewTextInput 
                            value="0"
                            keyboardType="number-pad"
                            style={styles.quantityConMiddleInput}
                        />
                        </View>
                        <View style={styles.quantityConRight}>
                        <TouchableOpacity style={styles.quantityButton}>
                            <MaterialCommunityIcons name="plus" size={20} color="green" />
                        </TouchableOpacity>
                        </View>
                    </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                    <Button mode="text" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={18} color="red" />
                    </Button>
                    </DataTable.Cell>
                </DataTable.Row> 

                <DataTable.Row>
                    <DataTable.Cell>
                    <Text style={styles.itemTitle}>Frozen yogurt</Text>
                    </DataTable.Cell>
                    <DataTable.Cell >{'\u0024'}3,000</DataTable.Cell>
                    <DataTable.Cell>
                    <View style={styles.quantityCon}>
                        <View style={styles.quantityConLeft}>
                        <TouchableOpacity style={styles.quantityButton}>
                            <MaterialCommunityIcons name="minus" size={20} color="red" />
                        </TouchableOpacity>
                        </View>
                        <View style={styles.quantityConMiddle}>
                        <NewTextInput 
                            value="0"
                            keyboardType="number-pad"
                            style={styles.quantityConMiddleInput}
                        />
                        </View>
                        <View style={styles.quantityConRight}>
                        <TouchableOpacity style={styles.quantityButton}>
                            <MaterialCommunityIcons name="plus" size={20} color="green" />
                        </TouchableOpacity>
                        </View>
                    </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                    <Button mode="text" labelStyle={{ fontFamily: 'Montserrat-Medium', }} style={styles.closeButton}>
                        <MaterialCommunityIcons name="close" size={18} color="red" />
                    </Button>
                    </DataTable.Cell>
                </DataTable.Row> 
    
                </DataTable>
                <View style={{ padding: 10, width: '100%' }}>
                    <View style={styles.formGroup}> 
                        <TextInput
                            mode="outlined"
                            label="Delivery Frequency"  
                            style={{ height: 50, fontSize: 12,  }} 
                            right={  <TextInput.Icon name="arrow-down" size={20} color="#b22234" />}
                        />
                    </View> 
                    <Text style={[styles.headerText, { fontSize: 15 }]}>Stored Card: XXXX0015</Text>
                </View>
            </ScrollView>
          
            
            <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>                  
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('Subscription')} >
                    Authorize
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
  itemTitle:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  closeButton:{ 
    color: 'red', 
  },
  quantityCon:{
    width: '100%',
    height: 40,
    borderRadius: 5,
    flexDirection: 'row', 
    alignItems: 'center',
  },
  quantityConLeft:{
    width: '20%',
    height: '100%',
  },
  quantityConMiddle:{
    width: '60%',
    height: '100%',
  },
  quantityConRight:{
    width: '20%',
    height: '100%',
  },
  quantityButton:{ 
    width: '100%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4
  },
  quantityConMiddleInput:{
    width: '100%',
    height: '80%',
    left: 5,
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
  formGroup:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 20
  },
});
