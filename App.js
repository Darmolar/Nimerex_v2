import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { configureFonts, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import MyDrawer from './src/navigation/DrawerTab';

const theme = {
  ...DefaultTheme, 
};

export default function App() {
  const [loaded, error] = useFonts({ 
        'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        'Montserrat-Light': require('./assets/fonts/Montserrat-Light.ttf'),
        'Montserrat-Thin': require('./assets/fonts/Montserrat-Thin.ttf'),
        'Montserrat-Bold': require('./assets/fonts/Montserrat-Bold.ttf'), 
   }); 
   
  if (!loaded) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    )
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </PaperProvider>
  );
}