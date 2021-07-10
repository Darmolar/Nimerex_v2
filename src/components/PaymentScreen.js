import { initStripe } from '@stripe/stripe-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native'; 
 
const PaymentScreen = ({ paymentMethod, children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initialize() {
        setLoading(true)
            await initStripe({
                 publishableKey: 'pk_test_51HFTeDDTsjZr0XgPcARyAbLibQ5YO0VObZPwfuMP4k2h70WXr3Fe0wGgjVF3bOTl4keMbJhohgWfQYTU9UKnPMRr00G1kf3rFY',
                 merchantIdentifier: 'merchant.com.stripe.react.native',
                 urlScheme: 'stripe-example',
                 setUrlSchemeOnAndroid: true,
            });
        setLoading(false)
        }
        initialize(); 
    }, []);

    if(loading){
        return (
            <ActivityIndicator size="large" style={StyleSheet.absoluteFill} />
        )
    } 
    
    return (
        <ScrollView
            accessibilityLabel="payment-screen"
            style={styles.container}
            keyboardShouldPersistTaps="handled">
            {children}
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            <Text style={{ opacity: 0 }}>appium fix</Text>
        </ScrollView>
    )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
});

export default PaymentScreen;
