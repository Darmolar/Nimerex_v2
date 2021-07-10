import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image, FlatList, SafeAreaView , ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { Modal, Portal, Button, TextInput, FAB, DataTable  } from 'react-native-paper'; 

const { width, height } = Dimensions.get('window');
 
export default function GiftScreen({ navigation }) {
    const [visible, setVisible] = React.useState(false);
  
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


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
                        <DataTable.Title >Category</DataTable.Title>
                        <DataTable.Title >Store</DataTable.Title>  
                        <DataTable.Title numeric>Action</DataTable.Title>
                    </DataTable.Header>

                    <DataTable.Row>
                        <DataTable.Cell>
                            <Text style={styles.itemTitle}>Frozen</Text>
                        </DataTable.Cell>
                        <DataTable.Cell >
                            <Text style={styles.itemTitle}>African Grocery</Text>
                        </DataTable.Cell> 
                        <DataTable.Cell >
                            <Text style={styles.itemTitle}>Nimerex Grocery</Text>
                        </DataTable.Cell> 
                        <DataTable.Cell numeric> 
                            <MaterialCommunityIcons name="menu" size={18} color="red" onPress={() => showModal() } style={styles.closeButton} /> 
                        </DataTable.Cell>
                    </DataTable.Row>         
                </DataTable>
            </View>
        </View>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.containerStyle}>
          <View style={styles.listCon}>
              <Image source={{uri: 'https://www.nimerex.com/shop/storage/images/X5taHuQJN3h9WGyTqS0zxIa7f39DKnhXTmZ87mgF.jpeg'}} resizeMode={'contain'} style={{ width: '100%', height: 150, }} />
             <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('SendGift')} >
                 <Text style={styles.actionButtonText}>Send Gift</Text>
             </TouchableOpacity> 
          </View>
        </Modal>
        {/* <FAB
            style={styles.fab}
            large
            icon="plus"
            onPress={() => navigation.navigate('EditSubscription') }
        /> */}
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
