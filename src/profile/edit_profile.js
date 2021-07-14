import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, ImageBackground, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Button, TextInput, DataTable, Snackbar  } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import {Picker} from '@react-native-picker/picker';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window'); 

export default function EditProfileScreen({ navigation }) {
  const [ loading, setLoading ] = useState(true);
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ userDetails, setUserDetails ] = useState({
                                                    firstname: '',
                                                    lastname: '',
                                                    email: '',
                                                    country: '',
                                                    telephone: '',
                                                    city: '',
                                                    state_id: '',
                                                    country: '',
                                                    postal_code:'',
                                                    address: '',
                                                    suite_no: '' ,
                                                });
  const [ submitting, setSubmitting ] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const [ message, setMessage ] = useState('');
  const [ country, setCountries ] = useState([]);
  const [ state, setStates ] = useState([]);

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
//           setUserDetails(user);
           getProfileInfo(user.id)
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

  const getProfileInfo = async (user_id) => {
        setLoading(true);
        fetch(`${live_url}profile/find/${user_id}` )
          .then(response => response.json())
          .then(async(json) => {
            if(json.status == true ){
                setUserDetails(json.data);
            }
          })
          .catch(error => console.error(error))
          .finally(res => setLoading(false))
   }

  const updateProfileInfo = async () => {
       if(userDetails.firstname === '' ||
           userDetails.lastname === '' ||
           userDetails.country === '' ||
           userDetails.telephone === '' ||
           userDetails.address === '' ||
           userDetails.postal_code === '' ||
           userDetails.suite_no === '' ||
           userDetails.firstname ===  null ||
           userDetails.lastname === null ||
           userDetails.country === null ||
           userDetails.telephone === null ||
           userDetails.address === null ||
           userDetails.suite_no === null ){
            setMessage('All fields are required');
            setVisible(true);
              console.log(userDetails);
            return false;
       }else{
            setSubmitting(true);
            var new_payment_data = new FormData;
              new_payment_data.append('user_id', userDetails.id);
              new_payment_data.append('firstname', userDetails.firstname);
              new_payment_data.append('lastname', userDetails.lastname);
              new_payment_data.append('telephone', userDetails.telephone);
              new_payment_data.append('email', userDetails.email);
              new_payment_data.append('city', userDetails.suburb_or_town);
              new_payment_data.append('state_id', parseInt(userDetails.state_id));
              new_payment_data.append('country', parseInt(userDetails.country));
              new_payment_data.append('postal_code', userDetails.postal_code);
              new_payment_data.append('address', userDetails.address);
              new_payment_data.append('suite_no', userDetails.suite_no);
                setSubmitting(true);
                fetch(`${live_url}profile/update`,{
                 method: 'POST',
                 headers: {
                   Accept: 'application/json',
                   'Content-Type': 'multipart/form-data'
                 },
                 body: new_payment_data
                } )
                  .then(response => response.json())
                  .then((json) => {
                    if(json.status == true){
                        setMessage(json.message);
                        setVisible(true);
                    }else{
                        setMessage('There is an error on your details check again.');
                        setVisible(true);
                        return false;
                    }
                  })
                  .catch(error => console.error(error))
                  .finally(res => setSubmitting(false));
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
          <Text style={styles.headerText}>Edit Profile</Text> 
          <View></View>
        </View>
        <View style={styles.body}>
          {
            isLoggedIn == true
            ?
            <ScrollView style={[styles.conList, { marginBottom: 100, }]}>
                <View style={styles.formGroup}>
                  <TextInput
                    label="First Name"
                    style={{ height: 50, fontSize: 12 }}
                    value={userDetails.first_name}
                    onChangeText={val => setUserDetails({ ...userDetails, firstname: val })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <TextInput
                    label="Last Name"
                    style={{ height: 50, fontSize: 12 }}
                    value={userDetails.last_name}
                    onChangeText={val => setUserDetails({ ...userDetails, lastname: val })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <TextInput
                    label="Email Address"
                    style={{ height: 50, fontSize: 12 }}
                    editable={false}
                    value={userDetails.email}
                    onChangeText={val => setUserDetails({ ...userDetails, email: val })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <TextInput
                    label="Mobile No"
                    style={{ height: 50, fontSize: 12 }}
                    keyboardType="number-pad"
                    editable={false}
                    value={userDetails.telephone}
                    onChangeText={val => setUserDetails({ ...userDetails, telephone: val })}
                  />
                </View>
                <View style={styles.formGroup}>
                  <TextInput
                    label="Postal Code"
                    style={{ height: 50, fontSize: 12 }}
                    keyboardType="number-pad"
                    value={userDetails.postal_code}
                    onChangeText={val => setUserDetails({ ...userDetails, postal_code: val })}
                  />
                </View>
               <View style={styles.formGroup}>
                 <TextInput
                   label="Appt/Suite No"
                   style={{ height: 50, fontSize: 12 }}
                    value={userDetails.suite_no}
                    onChangeText={val => setUserDetails({ ...userDetails, suite_no: val }) }
                 />
               </View>
                <View style={styles.formGroup}>
                  <TextInput
                    label="Town"
                    style={{ height: 50, fontSize: 12 }}
                    value={userDetails.suburb_or_town}
                    onChangeText={val => setUserDetails({ ...userDetails, suburb_or_town: val })}
                  />
                </View>
                <View style={styles.formGroup}>
                    <Picker
                          style={{ height: 50, fontSize: 12 }}
                          selectedValue={userDetails.country}
                          onValueChange={(itemValue, itemIndex) =>
                             setUserDetails({ ...userDetails, country: itemValue })
                          }
                      >
                      {
                        country.map((item, index) => (
                            <Picker.Item key={index}  label={item.name} value={item.id} />
                        ))
                      }
                    </Picker>
                </View>
                <View style={styles.formGroup}>
                    <Picker
                          style={{ height: 50, fontSize: 12 }}
                          selectedValue={userDetails.state_id}
                          onValueChange={(itemValue, itemIndex) =>
                             setUserDetails({ ...userDetails, state_id: itemValue })
                          }
                      >
                      {
                        state.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.id} />
                        ))
                      }
                    </Picker>
                </View>
                <View style={[styles.formGroup, { height: 150 }]}>
                     <TextInput
                       label="Street Address"
                       multiline={true}
                       style={{ height: 150, fontSize: 12 }}
                       value={userDetails.address}
                       onChangeText={val => setUserDetails({ ...userDetails, address: val })}
                     />
                </View>
                <View style={{ width: '100%' }}>
                    <Button loading={submitting} compact={true}  mode="contained" color="#b22234" style={styles.button}  onPress={() =>  updateProfileInfo()} >
                        Update
                    </Button>
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
              </ScrollView>
            :
                <View style={{ width: '80%', alignSelf: 'center', marginTop: 20 }}>
                    <Button compact={true} mode="contained" color="#b22234" style={styles.button}
                        onPress={() => navigation.navigate('Login') } >
                        Login before checkout
                    </Button>
                </View>
          }

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
