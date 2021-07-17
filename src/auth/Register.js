import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Button, TextInput, Snackbar  } from 'react-native-paper'; 
import { live_url, SecureStore } from '../Network';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [ secureText, setSecureText ] = useState(true);
  const [ submitting, setSubmitting ] = useState(false);
  const [visible, setVisible] = React.useState(false); 
  const [ message, setMessage ] = useState('');
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
 
  const onDismissSnackBar = () => { setMessage(''); setVisible(false) };
  const register = async () => {
    if(userDetails.firstname == "" ||
        userDetails.lastname == "" ||
        userDetails.email == "" || 
        userDetails.password == "" || 
        userDetails.dob == "" ||
        userDetails.telephone == "" ||
        userDetails.country == "" ){
          setMessage('All feilds are required');
          setVisible(true);
          return false;
    }else{
      setSubmitting(true);
      var new_data = new FormData;
      new_data.append('country', userDetails.country);
      new_data.append('dob', userDetails.dob);
      new_data.append('email', userDetails.email);
      new_data.append('firstname', userDetails.firstname);
      new_data.append('lastname', userDetails.lastname);
      new_data.append('password', userDetails.password);
      new_data.append('telephone', userDetails.telephone);
      new_data.append('username', userDetails.firstname);
      console.log(new_data);
      fetch(`${live_url}auth/register`,{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            },
            body: new_data
          })
      .then(response => response.json())
      .then(async(json) => {
        console.log(json);
         if(json.status == true){
           setMessage(json.message);
           setVisible(true)
            await SecureStore.setItemAsync('user_details', JSON.stringify(json.data.user_details));
            await SecureStore.setItemAsync('token', json.data.token);
            navigation.navigate('DashboardTabs', { screen: 'Home' })
         }else{
           setMessage(json.message);
           setVisible(true)
         }
      })
      .catch(error => console.error(error))
      .finally(res => setSubmitting(false)) 
    }
  }
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.head}>
            <MaterialIcons name="keyboard-arrow-left" size={24} size={24} color="#b22234" onPress={() => navigation.goBack() }  />
            <Animatable.Text animation="zoomInUp" style={styles.headerText}>Let's sign you up.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Welcome.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Create an account and let us serve you.</Animatable.Text>
        </View>
        <Animatable.View animation="zoomInDown" style={styles.body}> 
          <ScrollView animation="zoomInDown" showsVerticalScrollIndicator={false} style={styles.formBox}>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="First Name"
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold'}}
                  value={userDetails.first_name}
                  onChangeText={val => setUserDetails({ ...userDetails, firstname: val })}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="Last Name"
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.last_name}
                  onChangeText={val => setUserDetails({ ...userDetails, lastname: val })}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="Telephone"
                  keyboardType="number-pad"
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.telephone}
                  onChangeText={val => setUserDetails({ ...userDetails, telephone: val })}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="Email" 
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.email}
                  onChangeText={val => setUserDetails({ ...userDetails, email: val })}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="DOB" 
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.dob}
                  onChangeText={val => setUserDetails({ ...userDetails, dob: val })}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  mode="outlined"
                  label="Country" 
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.country}
                  onChangeText={val => setUserDetails({ ...userDetails, country: val })}
                />
            </View>
            <View style={[styles.formGroup]}>
              <TextInput 
                  mode="outlined"
                  label="Password"
                  style={{ height: 50, fontSize: 12, fontFamily: 'Montserrat-Bold',}}
                  value={userDetails.password}
                  onChangeText={val => setUserDetails({ ...userDetails, password: val })}
                  secureTextEntry={secureText}
                  right={ <TextInput.Icon name={ secureText ? "eye" : "eye-off"  } color="#b22234" onPress={() => setSecureText(!secureText)} />}
                />  
            </View> 
            <View style={{ width: '100%' }}>  
              <Pressable onPress={() => navigation.navigate('Login')} >
                <Text style={{  fontSize: 12, textAlign: 'center', marginBottom: 20, fontFamily: 'Montserrat-Regular',  }}>Already have an account? <Text style={{ fontFamily: 'Montserrat-Bold', color: '#b22234'  }}>Login</Text></Text>
              </Pressable>
              <TouchableOpacity style={styles.button}  onPress={() => register()} >
                {
                     submitting == true
                    ?
                        <ActivityIndicator color="#fff" />
                    :
                        <Text style={styles.buttonText}>Register</Text>
                }
              </TouchableOpacity>
            </View>  
          </ScrollView>
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
        </Animatable.View>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  head:{
    width,
    flex: .8,
    padding: 20, 
    justifyContent: 'center',
  },
  body:{
    width,
    flex: 3.2,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText:{
    fontSize: 25,
    fontFamily: 'Montserrat-Bold', 
    top: '5%'
  },
  headerTexth2:{
    fontSize: 20,
    fontFamily: 'Montserrat-Regular', 
    top: '10%'
  }, 
  formBox:{
    width: '100%',
  },
  formGroup:{
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 10
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
    borderRadius: 10,
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    textTransform: 'capitalize',
    color: '#fff'
  }
});