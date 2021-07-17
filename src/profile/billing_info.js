import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, Snackbar  } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {Picker} from '@react-native-picker/picker';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window');

export default function BillingInfoScreen({ navigation }) {
  const [ loading, setLoading ] = useState(true);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({
                                                    firstname: '',
                                                    lastname: '',
                                                    email: '',
                                                    password: '',
                                                    dob: '',
                                                    country: '',
                                                    telephone: '',
                                                    username: ''
                                                });
  const [visible, setVisible] = React.useState(false);
  const [ message, setMessage ] = useState('');
  const [ submitting, setSubmitting ] = useState(false);
  const [ country, setCountries ] = useState([]);
  const [ state, setStates ] = useState([]);
  const [ billingInfo, setBillingInfo ] = useState({
                                                    phone: '',
                                                    email: '',
                                                    suburb_or_town: '',
                                                    state_or_territory: '',
                                                    country: '',
                                                    post_code: '',
                                                    full_address: '',
                                                    suite_no: '',
                                                  });

  useEffect(() => {
    getUserDetails();
    geCountries();
    geStates();
  },[navigation]);

  const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

  const getUserDetails = async () => {
     let token = await SecureStore.getItemAsync('token');
     if(token !== null){
        setIsLoggedIn(true);
        let data = await SecureStore.getItemAsync('user_details');
        if(data !== null){
           var user = JSON.parse(data);
           setUserDetails(user);
           getBillingInfo(user.id);
        }
     }else{
        setIsLoggedIn(false)
     }
   }

  const geCountries = async () => {
        setLoading(true);
        fetch(`${live_url}country` )
          .then(response => response.json())
          .then(async(json) => {
            if(json.status == true ){
                setCountries(json.data);
            }
          })
          .catch(error => console.error(error))
          .finally(res => setLoading(false))
   }

  const geStates = async () => {
       setLoading(true);
       fetch(`${live_url}state` )
         .then(response => response.json())
         .then(async(json) => {
           if(json.status == true ){
               setStates(json.data);
           }
         })
         .catch(error => console.error(error))
         .finally(res => setLoading(false))
      }

  const getBillingInfo = async (user_id) => {
        setLoading(true);
        fetch(`${live_url}address/find/${user_id}` )
          .then(response => response.json())
          .then(async(json) => {
            console.log(json);
            if(json.status == true ){
                setBillingInfo(json.data);
            }
          })
          .catch(error => console.error(error))
          .finally(res => setLoading(false))
   }

  const updateInfo = async () => {
       if(billingInfo.phone == '' ||
           billingInfo.email == '' ||
           billingInfo.suburb_or_town == '' ||
           billingInfo.state_or_territory == '' ||
           billingInfo.post_code == '' ||
           billingInfo.full_address == '' ||
           billingInfo.suite_no == '' ){
            setMessage('All fields are required');
            setVisible(true);
            return false;
       }else{
       console.log(userDetails)
        setSubmitting(true);
        if(billingInfo.id){
            var new_payment_data = new FormData;
              new_payment_data.append('user_id', userDetails.id);
              new_payment_data.append('phone', billingInfo.phone);
              new_payment_data.append('email', billingInfo.email);
              new_payment_data.append('suburb_or_town', billingInfo.suburb_or_town);
              new_payment_data.append('state_or_territory', billingInfo.state_or_territory);
              new_payment_data.append('country', billingInfo.country);
              new_payment_data.append('post_code', billingInfo.post_code);
              new_payment_data.append('full_address', billingInfo.full_address);
              new_payment_data.append('suite_no', billingInfo.suite_no);
              new_payment_data.append('id', billingInfo.id);
                setSubmitting(true);;
                fetch(`${live_url}address/create`,{
                 method: 'POST',
                 headers: {
                   Accept: 'application/json',
                   'Content-Type': 'multipart/form-data'
                 },
                 body: new_payment_data
                } )
                  .then(response => response.json())
                  .then((json) => {
                    console.log(json);
                    if(json.status == true ){
                        setMessage(json.message);
                        setVisible(true);
                        return false;
                    }else{
                        setMessage('There is an error on your details');
                        setVisible(true);
                        return false;
                    }
                  })
                  .catch(error => console.error(error))
                  .finally(res => setSubmitting(false))
        }else{
            var new_payment_data = new FormData;
              new_payment_data.append('user_id', userDetails.id);
              new_payment_data.append('phone', billingInfo.phone);
              new_payment_data.append('email', billingInfo.email);
              new_payment_data.append('suburb_or_town', billingInfo.suburb_or_town);
              new_payment_data.append('state_or_territory', billingInfo.state_or_territory);
              new_payment_data.append('country', billingInfo.country);
              new_payment_data.append('post_code', billingInfo.post_code);
              new_payment_data.append('full_address', billingInfo.full_address);
              new_payment_data.append('suite_no', billingInfo.suite_no);
                setSubmitting(true);;
                fetch(`${live_url}address/create`,{
                 method: 'POST',
                 headers: {
                   Accept: 'application/json',
                   'Content-Type': 'multipart/form-data'
                 },
                 body: new_payment_data
                } )
                  .then(response => response.json())
                  .then((json) => {
                    console.log(json);
                    if(json.status == true ){
                        setMessage(json.message);
                        setVisible(true);
                        return false;
                    }else{
                        setMessage('There is an error on your details');
                        setVisible(true);
                        return false;
                    }
                  })
                  .catch(error => console.error(error))
                  .finally(res => setSubmitting(false))
        }
       }
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
          <MaterialCommunityIcons name="arrow-left" size={20} color="#b22234" onPress={() => navigation.goBack() }   />
          <Text style={styles.headerText}>Billing Info</Text> 
          <View></View>
        </View>
        <View style={[styles.body, { marginBottom: 20, }]}>
          <ScrollView style={styles.conList}>
           <View style={styles.formGroup}>
            <TextInput
              label="Email"
              style={{ height: 50, fontSize: 12 }}
              value={billingInfo.email}
              onChangeText={val => setBillingInfo({ ...billingInfo, email: val })}
            />
          </View>
            <View style={styles.formGroup}>
               <TextInput
                 label="Phone"
                 keyboardType='number-pad'
                 style={{ height: 50, fontSize: 12 }}
                    value={billingInfo.phone}
                    onChangeText={val => setBillingInfo({ ...billingInfo, phone: val })}
               />
            </View>
           <View style={styles.formGroup}>
             <TextInput
               label="Appt/Suite No"
               style={{ height: 50, fontSize: 12 }}
                    value={billingInfo.suite_no}
                    onChangeText={val => setBillingInfo({ ...billingInfo, suite_no: val })}
             />
           </View>
            <View style={styles.formGroup}>
                <Picker
                      style={{ height: 50, fontSize: 12 }}
                      selectedValue={billingInfo.country}
                      onValueChange={(itemValue, itemIndex) =>
                         setBillingInfo({ ...billingInfo, country : itemValue })
                      }
                  >
                  {
                    country.map((item, index) => (
                        <Picker.Item key={index}  label={item.name} value={item.sort_name} />
                    ))
                  }
                </Picker>
            </View>
            <View style={styles.formGroup}>
                <Picker
                      style={{ height: 50, fontSize: 12 }}
                      selectedValue={billingInfo.state_or_territory}
                      onValueChange={(itemValue, itemIndex) =>
                         setBillingInfo({ ...billingInfo, state_or_territory: itemValue })
                      }
                  >
                  {
                    state.map((item, index) => (
                        <Picker.Item key={index} label={item.name} value={item.name} />
                    ))
                  }
                </Picker>
            </View>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Town"
                style={{ height: 50, fontSize: 12 }}
                    value={billingInfo.suburb_or_town}
                    onChangeText={val => setBillingInfo({ ...billingInfo, suburb_or_town: val })}
              />
            </View>
            <View style={styles.formGroup}> 
              <TextInput 
                label="Postal Code"
                style={{ height: 50, fontSize: 12 }}
                keyboardType="number-pad"
                    value={billingInfo.post_code}
                    onChangeText={val => setBillingInfo({ ...billingInfo, post_code: val })}
              />
            </View>
            <View style={[styles.formGroup, { height: 150 }]}>
             <TextInput
               label="Street Address"
               multiline={true}
               style={{ height: 150, fontSize: 12 }}
                    value={billingInfo.full_address}
                    onChangeText={val => setBillingInfo({ ...billingInfo, full_address: val })}
             />
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
            <View style={{ width: '100%' }}>
               <TouchableOpacity style={[styles.button]}  onPress={() => updateInfo() } >
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
    marginBottom: 100,
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
    backgroundColor: '#b22234',
    borderRadius: 10,
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'capitalize',
    color: '#fff'
  },
});
