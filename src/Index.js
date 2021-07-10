import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Pressable, TouchableOpacity, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button from '@material-ui/core/Button';

const { width, height } = Dimensions.get('window');

export default function IndexScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.head}>
          <Animatable.Image animation="fadeInUp" easing="ease-out" resizeMode="contain" source={require('../assets/nimarex_image.png')} style={{ width: '50%', height: '50%'}} />
        </View>
        <View style={styles.body}>
            <Animatable.Text animation="zoomInUp" style={styles.headerText}>Enjoy Free Shipping on Grocery & many more</Animatable.Text>
            <Animatable.View animation="zoomInDown" style={styles.butonBottom}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')} style={[styles.button, { backgroundColor: '#fff', borderRadius: 5 }]}> 
                  <Text style={styles.buttonText}>REGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.button}> 
                  <Text style={[styles.buttonText, { color: '#fff' }]}>LOGIN</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
  },
  head:{
    width,
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  body:{
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerText:{
    fontSize: 25,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'center',
    top: '10%'
  },
  butonBottom:{
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    flexDirection: 'row',
    borderRadius: 5
  },
  button:{
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText:{
    fontSize: 15,
    fontFamily: 'Montserrat-Bold',
  }
});
