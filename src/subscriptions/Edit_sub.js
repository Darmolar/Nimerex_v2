import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, Snackbar  } from 'react-native-paper';
import {Picker} from '@react-native-picker/picker';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window');

export default function EditNewSubscriptionScreen({ navigation, route }) {
    const [ loading, setLoading ] = useState(true);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ userDetails, setUserDetails ] = useState({});
    const [ submitting, setSubmitting ] = useState(false);
    const [ subDetails, setSubDetails ] = useState(route.params.item);
    const [ visible, setVisible ] = React.useState(false);
    const [ message, setMessage ] = useState('');
    const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

    useEffect(() => {
      getUserDetails();
    },[navigation]);

    const getUserDetails = async () => {
       let token = await SecureStore.getItemAsync('token');
       if(token !== null){
          setIsLoggedIn(true);
          let data = await SecureStore.getItemAsync('user_details');
          if(data !== null){
             setUserDetails(JSON.parse(data));
             setLoading(false);
          }
       }else{
          setIsLoggedIn(false)
       }
     }

    const createSub = async () => {
        if(subDetails.frequency == ''){
            setMessage('All fields are required');
            setVisible(true);
            return false;
        }
          setSubmitting(true);
          var new_payment_data = new FormData;
          new_payment_data.append('user_id', userDetails.id);
          new_payment_data.append('frequency', subDetails.frequency);
          new_payment_data.append('name', subDetails.name);
          new_payment_data.append('id', subDetails.id);
            fetch(`${live_url}subscription/update`,{
             method: 'POST',
             headers: {
               Accept: 'application/json',
               'Content-Type': 'multipart/form-data'
             },
             body: new_payment_data
            })
              .then(response => response.json())
              .then((json) => {
                if(json.status == true){
                    setMessage(json.message);
                    setVisible(true);
                    navigation.navigate('Subscription');
                }else{
                    setMessage(json.message);
                    setVisible(true);
                    return false;
                }
              })
              .catch(error => console.error(error))
              .finally(res => setSubmitting(false));
    }

    if(loading){
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )
    }

  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={20} color="#4BA716" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Edit SubScription </Text>
          {/* <MaterialCommunityIcons name="cart-off" size={20} color="#4BA716" size={26} /> */}
          <View></View>
        </View>
        <View style={styles.body}>
            {
               isLoggedIn
               ?
                <ScrollView style={styles.cartCon}>
                    <View style={{ padding: 10, width: '100%' }}>
                        <View style={styles.formGroup}>
                            <TextInput
                                mode="outlined"
                                label="Name (optional)"
                                style={{ height: 50, fontSize: 12,  }}
                                value={subDetails.name}
                                onChangeText={val => setSubDetails({ ...subDetails, name: val }) }
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Picker
                                  style={{ height: 50, fontSize: 12 }}
                                  selectedValue={subDetails.frequency}
                                  onValueChange={(itemValue, itemIndex) => setSubDetails({ ...subDetails, frequency: itemValue }) }
                              >
                              <Picker.Item label='Frequency' value='' />
                              <Picker.Item label='WEEKLY' value='WEEKLY' />
                              <Picker.Item label='MONTHLY' value='MONTHLY' />
                            </Picker>
                        </View>
                    </View>
                    <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                        <TouchableOpacity style={styles.button}  onPress={() => createSub()} >
                           {
                                 submitting == true
                                ?
                                    <ActivityIndicator color="#fff" />
                                :
                                    <Text style={styles.buttonText}>Update</Text>
                           }
                        </TouchableOpacity>
                    </View>
                </ScrollView>
               :
                <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                    <TouchableOpacity style={styles.button}  onPress={() => login()} >
                       {
                             submitting == true
                            ?
                                <ActivityIndicator color="#fff" />
                            :
                                <Text style={styles.buttonText}>Login</Text>
                       }
                    </TouchableOpacity>
                </View>
            }
        </View>
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          action={{
            label: 'Close',
            onPress: () => {
              setMessage('');
              setVisible(false);
            },
          }}>
          { message }
        </Snackbar>
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
  button:{
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4BA716',
    borderRadius: 10,
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'capitalize',
    color: '#fff'
  }
});
