import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Modal, Portal, Button, TextInput, FAB, DataTable  } from 'react-native-paper';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window');

export default function SubscriptionScreen({ navigation }) {
    const [visible, setVisible] = React.useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ userDetails, setUserDetails ] = useState({});
    const [ submitting, setSubmitting ] = useState(false);
    const [ subDetails, setSubDetails ] = useState({
                                                    name: '',
                                                    frequency: ''
                                                   });
    const [ mySubs, setMySubs ] = useState([]);
    const [ selected, setSelected ] = useState({});

    useEffect(() => {
      getUserDetails();
      const unsubscribe = navigation.addListener('focus', () => {
          getUserDetails();
      });
      return unsubscribe;
    },[navigation]);

    const showModal = (item) => { setSelected(item); setVisible(true)};
    const hideModal = () => setVisible(false);

    const getUserDetails = async () => {
       let token = await SecureStore.getItemAsync('token');
       if(token !== null){
          setIsLoggedIn(true);
          let data = await SecureStore.getItemAsync('user_details');
          if(data !== null){
             setUserDetails(JSON.parse(data));
             setLoading(false);
             getMySubs(JSON.parse(data).id);
          }
       }else{
          setIsLoggedIn(false);
          navigation.navigate('Login')
       }
     }

    const getMySubs = async (user_id) => {
        setLoading(true);
        fetch(`${live_url}subscription/user/${user_id}` )
          .then(response => response.json())
          .then(async(json) =>{
                if(json['status'] == true && json.data.length > 0 ){
                  setMySubs(json.data);
                }else{
                  setMySubs([])
                }
          })
          .catch(error => console.error(error))
          .finally(res => setLoading(false))
      }

    const deleteSubs = async (item) => {
      setLoading(true);
      var new_payment_data = new FormData;
      new_payment_data.append('user_id', userDetails.id);
      new_payment_data.append('id', item.id);
        fetch(`${live_url}subscription/delete`,{
         method: 'POST',
         headers: {
           Accept: 'application/delete',
           'Content-Type': 'multipart/form-data'
         },
         body: new_payment_data
        })
          .then(response => response.json())
          .then((json) => {
            if(json.status == true){
                alert(json.message);
                hideModal();
                getUserDetails();
            }else{
                alert(json.message);
                return false;
            }
          })
          .catch(error => console.error(error))
          .finally(res => setLoading(false));
    }

    if(loading){
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )
    }
  return (
    <SafeAreaView  style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.header}>
          <MaterialCommunityIcons name="menu" size={24} color="#4BA716" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Subscription</Text>
          <MaterialCommunityIcons name="plus" size={24} color="#4BA716" size={26} />
        </View>
        <View style={styles.body}> 
            <View style={styles.cartCon}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title >Frequency</DataTable.Title>
                        <DataTable.Title numeric>Total</DataTable.Title>
                        <DataTable.Title numeric>Action</DataTable.Title>
                    </DataTable.Header>
                    {
                        mySubs.length > 0 &&
                        mySubs.map((item, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>
                                    <Text style={styles.itemTitle}>{ item.name }</Text>
                                </DataTable.Cell>
                                <DataTable.Cell >
                                    <Text style={styles.itemTitle}>{ item.frequency }</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <Text style={styles.itemTitle}>{ item.total_cost }</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <TouchableOpacity style={{ width: '100%', height: '100%' }}>
                                      <MaterialCommunityIcons name="menu" size={25} color="#4BA716" onPress={() => showModal(item) } style={styles.closeButton} />
                                    </TouchableOpacity>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }
                </DataTable>
            </View>
        </View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <View style={styles.listCon}>
             <TouchableOpacity style={styles.actionButton} onPress={() => { hideModal(); navigation.navigate('EditNewSubscription', { item: selected }) } } >
                 <Text style={styles.actionButtonText}>Edit</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => { hideModal(); navigation.navigate('SubscriptionProducts', { item: selected }) } } >
                 <Text style={styles.actionButtonText}>Add Product(s)</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => { hideModal(); navigation.navigate('SubscriptionCart', { item: selected }) } }>
                 <Text style={styles.actionButtonText}>View Product(s)</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.actionButton} onPress={() => deleteSubs(selected) } >
                 <Text style={styles.actionButtonText}>Remove</Text>
             </TouchableOpacity>
          </View>
        </Modal>
        <FAB
            style={styles.fab}
            large
            icon="plus"
            onPress={() => navigation.navigate('EditSubscription') }
        />
    </SafeAreaView>
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#4BA716',
    color: '#fff'
  },
  cartCon:{
    padding: 10
  },
  itemTitle:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
  },
  closeButton:{
      width: 20,
      height: 20, 
  },
  containerStyle:{
      backgroundColor: 'white', 
      padding: 20,
      width: '90%',
      alignSelf: 'center',
  },
  listCon:{
    width: '100%',
  },
  actionButton:{
    width: '100%',
    height: 30,
    justifyContent: 'center',
    // padding: 10,
    // borderBottomWidth: .5,
    // borderColor: 'grey',
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: '#4BA716',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText:{
    fontSize: 13,
    fontFamily: 'Montserrat-Bold', 
    color: '#fff',
  }
});
