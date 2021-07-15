
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Alert, View, Dimensions, Image, FlatList, TextInput as NewTextInput, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import base64 from 'react-native-base64'
import { Button, TextInput, Snackbar, Switch  } from 'react-native-paper';
import { live_url, payment_url, live_url_image, SecureStore, addToCart, addToSavedItem } from './Network';

const { width, height } = Dimensions.get('window');

export default function ResponseScreen({ navigation, route }){
    const { response } = route.params;
    return (
        <View style={styles.container}>

        </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});