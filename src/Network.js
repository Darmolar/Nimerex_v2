import {  ToastAndroid } from "react-native";
import * as SecureStore from 'expo-secure-store';
const live_url = "https://www.nimerex.com/shop/api/";
const live_url_image = "https://www.nimerex.com/shop/";
const payment_url = "https://www.nimerex.com/nimerex/";

const addToCart = async (datas) => {  
    var item  = {
        id: datas.id,
        name: datas.name,
        price: datas.price,
        image_url: datas.image_url,
        qty: 1,
    }
    var cart_item = await SecureStore.getItemAsync('cart_item_item');
    if(cart_item !== null){
        var cart = JSON.parse(cart_item); 
        if(cart.length > 0){
            var checkingCart = 0;
            cart.forEach((element, index) => {
                if(element.id == item.id){
                    checkingCart += 1;
                    ToastAndroid.show("Item already in cart!", ToastAndroid.SHORT);
                }
            });
            if(checkingCart == 0){
                cart.push(item)
                await SecureStore.deleteItemAsync('cart_item_item')
                await SecureStore.setItemAsync('cart_item_item', JSON.stringify(cart) )
                ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
            }
        }else{
            cart.push(item)
            await SecureStore.deleteItemAsync('cart_item_item')
            await SecureStore.setItemAsync('cart_item_item', JSON.stringify(cart) )
            ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
        } 
    }else{
        var cart = [];
        cart.push(item)
        await SecureStore.setItemAsync('cart_item_item', JSON.stringify(cart) )
        ToastAndroid.show("Added to cart!", ToastAndroid.SHORT);
    }  
}

const addToSavedItem = async (datas) => { 
    var item  = {
        id: datas.id,
        name: datas.name,
        price: datas.price,
        image_url: datas.image_url,
    }
    var cart_item = await SecureStore.getItemAsync('saved_item');
    if(cart_item !== null){
        var cart = JSON.parse(cart_item); 
        if(cart.length > 0){
            var checkingCart = 0;
            cart.forEach((element, index) => {
                if(element.id == item.id){
                    checkingCart += 1;
                    ToastAndroid.show("already saved!", ToastAndroid.SHORT);
                }
            });
            if(checkingCart == 0){
                cart.push(item)
                await SecureStore.deleteItemAsync('saved_item')
                await SecureStore.setItemAsync('saved_item', JSON.stringify(cart) )
                ToastAndroid.show("saved item!", ToastAndroid.SHORT);
            }
        }else{
            cart.push(item)
            await SecureStore.deleteItemAsync('saved_item')
            await SecureStore.setItemAsync('saved_item', JSON.stringify(cart) )
            ToastAndroid.show("saved item!", ToastAndroid.SHORT);
        } 
    }else{
        var cart = [];
        cart.push(item)
        await SecureStore.setItemAsync('saved_item', JSON.stringify(cart) )
        ToastAndroid.show("saved item!", ToastAndroid.SHORT);
    }  
}

export { live_url, live_url_image, SecureStore, payment_url, addToCart, addToSavedItem }