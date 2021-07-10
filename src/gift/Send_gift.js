import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , Pressable, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons, AntDesign, Ionicons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, Modal } from 'react-native-paper'; 
import * as Contacts from 'expo-contacts';


const { width, height } = Dimensions.get('window'); 

export default function SendGiftScreen({ navigation }) { 
  const [visible, setVisible] = React.useState(false);
  const [ contacts, setContacts ] = React.useState([]);
  const [ fetchingContact, setFetchingContact ] = React.useState(false);
  const [ selectedContact, setSelectedContacts ] = React.useState([]);

  useEffect(() => {
    setFetchingContact(false);
    // setSelectedContacts([]);
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('We require contact permission to read the files');
      } 
    })();
  }, []);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const pickContact = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('We require contact permission to read the files');
      return false;
    } 
    setFetchingContact(true);
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
    setContacts(data);
    if (data.length > 0) { 
      showModal();
      // console.log(contact[0].phoneNumbers[0].number);
    }
    setFetchingContact(false);
  }

  const chooseItem = (phone, index) => {
    if(selectedContact.includes(phone)){
      var value = phone

      var arr = selectedContact;
      
      arr = arr.filter(function(item) {
          return item !== value
      })
      setSelectedContacts(arr);
      contacts[index].selected = false;
    }else{
      setSelectedContacts([...selectedContact, phone]);
      contacts[index].selected = true;
    }
    console.log(selectedContact);
  } 
  const removeItem = (phone) => {
    if(selectedContact.includes(phone)){
      var value = phone 
      var arr = selectedContact; 
      arr = arr.filter(function(item) {
          return item !== value
      })
      setSelectedContacts(arr);
      return true;
    }
    return false;
  } 

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Send Gift</Text> 
          {/* <MaterialCommunityIcons name="cart-off" size={20} color="#b22234" size={26} /> */}
          <View></View>
        </View>
        <View style={styles.body}>
            <View style={styles.cartCon}> 
                <View style={{ padding: 10, width: '100%' }}>
                    <Text style={{ fontSize: 13, marginVertical: 5, fontFamily: 'Montserrat-Medium' }}>Choose Recipient(s) phone number </Text>
                    {/* <Text style={{ fontSize: 13, marginVertical: 5, fontFamily: 'Montserrat-Medium', bottom: 5 }}>(Multiple recipient seperated by a comma allowed.) </Text> */}
                    
                    { 
                      fetchingContact 
                      ? 
                      <ActivityIndicator color="#b22234" size="large" /> 
                      :  
                      <Button mode="outlined" color="#b22234" style={{ marginVertical: 20, justifyContent:'center' }}  onPress={() => pickContact() } >
                          <Text style={{ fontSize: 13, fontFamily: 'Montserrat-Medium'}}> Select Contact <AntDesign name="contacts" size={24} color="#b22234"/> </Text>
                      </Button>
                    }
                    
 
                    <ScrollView style={{ width: '100%' }}>  
                      {
                        selectedContact.length > 0 &&
                        selectedContact.map((item, index) => (
                          <View style={styles.listCon} key={index}>
                              <Text  style={styles.listConText}>{ item }</Text>
                              <Ionicons name="close-sharp" size={24} color="#b22234" onPress={() => removeItem(item) }  />
                          </View>
                        ))
                      }
                    </ScrollView>  
                </View> 
            </View> 
            
            <View style={{ zIndex: -1, width: '80%', alignSelf: 'center', marginTop: 20,  }}>                  
                <Button mode="contained" color="#b22234" style={styles.button}  onPress={() => navigation.navigate('Gift')} >
                    Send Gift
                </Button>
            </View>
        </View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <ScrollView style={{ width: '100%' }}>
            {
              contacts.length > 0 &&
              contacts.map((item, index) => (
                <View style={styles.listCon} key={index}>
                    <Text style={styles.listConText}>{ item.name }</Text>
                    <TouchableOpacity onPress={() => chooseItem(item.phoneNumbers[0].number, index) } style={ item.selected ? [styles.listConButton, { backgroundColor: '#000' }]  : styles.listConButton}></TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
          <View style={{ zIndex: -1, width: '80%', alignSelf: 'center', marginTop: 20,  }}>                  
                <Button mode="outlined" color="#b22234" style={styles.button}  onPress={() => hideModal() } >
                    Choose Selected
                </Button>
            </View>
        </Modal>
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
  containerStyle:{
    zIndex: 10,
    backgroundColor: 'white', 
    padding: 20,
    height: '100%',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCon:{
    // width: '100%',
    padding: 10,
    borderBottomWidth: .4,
    borderColor: 'grey',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listConText:{
    fontSize: 14,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  listConButton:{
    width: 20,
    height: 20,
    borderColor: 5,
    borderWidth: .5,
    borderColor: 'grey'
  }
});
