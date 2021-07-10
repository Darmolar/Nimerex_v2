import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, Image, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { MaterialIcons } from '@expo/vector-icons'; 
import { Button, TextInput } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window');

export default function ResetScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.head}>
            <MaterialIcons name="keyboard-arrow-left" size={24} size={24} color="#b22234" onPress={() => navigation.goBack() }  />
            <Animatable.Text animation="zoomInUp" style={styles.headerText}>Reset password.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Hi.</Animatable.Text>
            <Animatable.Text animation="zoomInUp" style={styles.headerTexth2}>Reset password to regain access.</Animatable.Text>
        </View>
        <Animatable.View animation="zoomInDown" style={styles.body}> 
          <View style={styles.formBox}> 
            <View style={styles.formGroup}>
              <TextInput 
                  style={styles.input}
                  label="OTP"
                  mode="outlined" 
                  style={{ height: 50, fontSize: 12, }}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput 
                  style={styles.input}
                  label="New Password"
                  mode="outlined" 
                  style={{ height: 50, fontSize: 12, }}
                />
            </View>
            <View style={styles.formGroup}>
              <TextInput  
                  label="Confirm New Password"
                  mode="outlined" 
                  style={{ height: 50, fontSize: 12, }}
                />
            </View>   
          </View>

          <View style={{ width: '100%' }}>  
            <Pressable onPress={() => navigation.navigate('Login')} >
              <Text style={{  fontSize: 12, textAlign: 'center', marginBottom: 20, fontFamily: 'Montserrat-Regular' }}>Already have an account? <Text style={{ fontFamily: 'Montserrat-Bold', color: '#b22234' }}>Login</Text></Text>
            </Pressable>   
            <Button mode="contained" uppercase={true} color="#b22234" style={styles.button}  onPress={() => navigation.navigate('Reset')} >
              Update Password
            </Button>
          </View>
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
    flex: 1.2,
    padding: 20, 
    justifyContent: 'center',
  },
  body:{
    width,
    flex: 2.8,
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
  },
  buttonText:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#fff'
  }
});
