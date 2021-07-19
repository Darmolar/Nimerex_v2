import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';  
import { Button, TextInput, Snackbar  } from 'react-native-paper'; 
import { live_url, SecureStore } from '../Network';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [ secureText, setSecureText ] = useState(true);
  const [ submitting, setSubmitting ] = useState(false);
  const [visible, setVisible] = React.useState(false); 
  const [ message, setMessage ] = useState('');
  const [ userDetails, setUserDetails ] = useState({
                                                    email: '',
                                                    password: '',
                                                });
 
  const onDismissSnackBar = () => { setMessage(''); setVisible(false) };

  const login = async () => {
    if( userDetails.email == "" || 
        userDetails.password == ""    ){
          setMessage('All feilds are required');
          setVisible(true);
          return false;
    }else{
       setSubmitting(true);
       var new_data = new FormData;
       new_data.append('email', userDetails.email);
       new_data.append('password', userDetails.password);
       fetch(`${live_url}auth/login`,{
             method: 'POST',
             headers: {
               Accept: 'application/json',
               'Content-Type': 'multipart/form-data'
             },
             body: new_data
           })
       .then(response => response.json())
       .then(async(json) => {
          if(json.status == true){
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
            <Animatable.Text animation="zoomInUp" style={styles.headerText}>Let's sign you in.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Welcome back.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Login to enjoy our services.</Animatable.Text>
        </View>
        <View style={styles.body}> 
          <Animatable.View animation="zoomInDown" style={styles.formBox}>
            <View style={styles.formGroup}> 
              <TextInput
                mode="outlined"
                label="Email"  
                style={{ height: 50, fontSize: 12, }}
                value={userDetails.email}
                onChangeText={val => setUserDetails({ ...userDetails, email: val })}
              />
            </View>
            <View style={styles.formGroup}> 
              <TextInput
                mode="outlined"
                label="Password"  
                style={{ height: 50, fontSize: 12,  }}
                value={userDetails.password}
                onChangeText={val => setUserDetails({ ...userDetails, password: val })}
                secureTextEntry={secureText}
                right={ <TextInput.Icon name={ secureText ? "eye" : "eye-off"  } color="#4BA716" onPress={() => setSecureText(!secureText)} />}
              />
            </View> 
            <Pressable onPress={() => navigation.navigate('Forget_Password')} >
              <Text style={{  fontSize: 12, textAlign: 'right', fontFamily: 'Montserrat-Medium' }}>Forget password</Text>
            </Pressable>
          </Animatable.View>

          <View style={{ width: '100%' }}>  
            <Pressable onPress={() => navigation.navigate('Register')} >
              <Text style={{  fontSize: 12, textAlign: 'center', marginBottom: 20, fontFamily: 'Montserrat-Regular' }}>Dont have an account? <Text style={{ fontFamily: 'Montserrat-Bold', color: '#4BA716' }}>Register</Text></Text>
            </Pressable> 
            
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
  head:{
    width,
    flex: 1.5,
    padding: 20, 
    justifyContent: 'center',
  },
  body:{
    width,
    flex: 2.5,
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
