import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Modal, Portal, Button, TextInput, FAB, DataTable  } from 'react-native-paper';
import { live_url, live_url_image, SecureStore, addToCart, addToSavedItem } from '../Network';

const { width, height } = Dimensions.get('window');
 
export default function GiftScreen({ navigation }) {
  const [ loading, setLoading ] = useState(true);
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
  const [ visible, setVisible ] = React.useState(false);
  const [ gifts, setGifts ] = useState([]);
  const [ selected, setSelected ] = useState({});

  useEffect(() => {
    getUserDetails();
    getGifts();
  },[navigation]);

  const getUserDetails = async () => {
     let token = await SecureStore.getItemAsync('token');
     if(token !== null){
        let data = await SecureStore.getItemAsync('user_details');
        if(data !== null){
            var user = JSON.parse(data);
            setUserDetails(user);
        }
     }
   }

  const getGifts = async () => {
       setLoading(true);
       fetch(`${live_url}gift` )
         .then(response => response.json())
         .then(async(json) => {
           if(json.status == true ){
               setGifts(json.data.data);
           }
         })
         .catch(error => console.error(error))
         .finally(res => setLoading(false))
      }

  const showModal = (item) => { setSelected(item); setVisible(true)};
  const hideModal = () => setVisible(false);

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
          <MaterialCommunityIcons name="menu" size={24} color="#b22234" onPress={() => navigation.toggleDrawer() }   />
          <Text style={styles.headerText}>Free Gifts</Text> 
          <MaterialCommunityIcons name="plus" size={24} color="#b22234" size={26} />
        </View>
        <View style={styles.body}> 
            <View style={styles.cartCon}>
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title >Store</DataTable.Title>  
                        <DataTable.Title numeric>Action</DataTable.Title>
                    </DataTable.Header>

                    {
                        gifts.length > 0 &&
                        gifts.map((item, index) => (
                            <DataTable.Row key={index}>
                                <DataTable.Cell>
                                    <Text style={styles.itemTitle}>{ item.name }</Text>
                                </DataTable.Cell>
                                <DataTable.Cell >
                                    <Text style={styles.itemTitle}>{ item.shop_name }</Text>
                                </DataTable.Cell>
                                <DataTable.Cell numeric>
                                    <MaterialCommunityIcons name="menu" size={20} color="red" onPress={() => navigation.navigate('SendGift', { item: selected }) } style={styles.closeButton} />
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))
                    }


                </DataTable>
            </View>
        </View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <View style={styles.listCon}>
              <Image source={ { uri:  live_url_image+selected.image_url } } resizeMode={'contain'} style={{ width: '100%', height: 150, }} />
             <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SendGift', { item: selected })} >
                 <Text style={styles.actionButtonText}>Send Gift</Text>
             </TouchableOpacity> 
          </View>
        </Modal>
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
    backgroundColor: '#b22234',
    color: '#fff'
  },
  cartCon:{
    padding: 10
  },
  itemTitle:{
    fontSize: 12,
    fontFamily: 'Montserrat-Medium', 
    color: '#000',
    padding: 5,
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
    backgroundColor: '#b22234',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText:{
    fontSize: 13,
    fontFamily: 'Montserrat-Bold', 
    color: '#fff',
  }
});
