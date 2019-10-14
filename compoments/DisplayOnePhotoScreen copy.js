import React, { Component } from 'react';
import { Image, ScrollView, Text, Button, StyleSheet, View, TouchableHighlight, Alert, Dimensions } from 'react-native';
import styles from './styles';
import {AsyncStorage} from 'react-native';

//import * as GLOBAL from './global.js';
//import  GLOBAL from './global.js';
import { RetrieveData, StoreData, ConfirmAlert } from './helpers.js'

class DisplayPhotoScreen extends Component{

  static navigationOptions = ({navigation}) => {
    return {
    title: navigation.getParam('dt', ''),
  }};

  /*findPhoto = (photo, uri) => {
    return photo.uri == uri;
  }*/

  state = {
    is_cover: false,

  }

  setCover = (uri) => {

    console.log('****In DisplayOnePhotoScreen setCover method.*****');

    let groups = global.groups;
    let group_id = global.group_id;
    global.cover = uri;

    if (group_id !== 0 ){
      let index = groups.findIndex( g => {
        return g.id == group_id;        
      })

      if (index > -1){

        groups[index].cover = uri;
        global.groups = groups;

        /*let group_delta = {
          id : group_id,
          cover: uri,
        };*/
    
        //AsyncStorage.mergeItem('groups', JSON.stringify(group_delta));
        StoreData('groups', groups);

      }    
    }

    //this.props.navigation.push('GroupPhotos');


  }

  deletePhoto = (uri) => {

    console.log('****In DisplayOnePhotoScreen deletePhoto method.*****');

    const alert_title = 'Alert';
    const alert_text = 'Are you sure to delete this photo?';
    const cancel_text = 'Cancel';
    const ok_text = 'Delete Photo';
    
    //let result = ConfirmAlert(alert_title, alert_text, cancel_text, ok_text);
    //console.log('Alert result: ', result);

    Alert.alert(
      'Alert',
      'Are you sure to delete this photo?',
      [
        {
        text: 'Cancel',
        onPress: () => {
          console.log('Cancel Pressed');
        },
        style: 'cancel',
        },    
        {
          text: 'Delete', 
          onPress: () => {
            console.log('Yes Pressed');
            let groups = global.groups;
            let group_id = global.group_id;
            let photos = global.photos;
            console.log('photos length from global, before delete: ', photos.length);
      
            var p_index = photos.findIndex(p => {
              //console.log('p.uri: ', p.uri);
              return p.uri == uri
            });
      
            let empty_group = false;
            if (p_index > -1){
              console.log('photo deleted.');
              photos.splice(p_index, 1);
              global.photos = photos;
              console.log('photos length from global, after delete: ', photos.length);
              if (group_id !== 0){
                console.log('group_id: ', group_id);
                let g_index = groups.findIndex( g => {
                  console.log('g.id: ', g.id);
                  return g.id == group_id;
                });
        
                console.log('%%% g_index :', g_index);
            
                if (g_index > -1){
                  if (photos.length == 0){
                    // empty group, should be deleted.
                    groups.splice(g_index, 1);
                    empty_group = true;
                    //global.groups = groups;
                    //StoreData('groups', groups);
                    //this.props.navigation.push('Groups');
                  }
                  else{
                    groups[g_index].photos = photos;
                  }       
                  
                  global.groups = groups;
                  StoreData('groups', groups);
                }
              }            
            }  
      
            if ( empty_group == true ){
              console.log('$$$$$Empty group');
              this.props.navigation.push('Groups'); 
            }
            else{
              console.log('$$$$$ Not Empty group');
              this.props.navigation.push('GroupPhotos');
            }   
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},      
    ); 
  
  }  

  renderCover = (uri) => {

    console.log('In renderButton method. global.group_id: ', global.group_id );   

    if ( global.cover == uri ){
      return(
        
        <Image source={require('./images/favorite.png')} style={{width:30, height:30}} />
      );
    }
    else{
      return (
        
        <TouchableHighlight onPress={() => this.setCover(uri)}>
            <Image source={require('./images/star.png')} 
            style={{width:30, height:30}} />
          </TouchableHighlight>    
      );      
    }
  }

  componentDidMount () {
    //Permissions.askAsync(Permissions.CAMERA_ROLL).then(d => console.log(d));

    let photo = navigation.getParam('photo', []);
    //console.log('photo data: ', photo);
    //let exif = photo.exif;
    //console.log('%%%% keys: ', Object.keys(exif));
    //const dt = Object.values(exif)[3].DateTime;
    //console.log('**** values: ', Object.values(exif)[3].DateTime);
    const p_uri = photo.uri;
    
    if ( p_uri == global.cover ){
      this.setState({'is_cover': true});
    }
  }

  render(){
    //GLOBAL.screen1State = this;
    const { width, height } = Dimensions.get('window')
    console.log('width: ', width);
    console.log('height: ', height);
    

    const { navigation} = this.props;
    //const p_uri = navigation.getParam('p_uri', '0');
    let photo = navigation.getParam('photo', []);
    //console.log('photo data: ', photo);
    //let exif = photo.exif;
    //console.log('%%%% keys: ', Object.keys(exif));
    //const dt = Object.values(exif)[3].DateTime;
    //console.log('**** values: ', Object.values(exif)[3].DateTime);
    const p_uri = photo.uri;
    const p_w = photo.width;
    const p_h = photo.height;

    let w = 100;
    let h = 100;
    if (p_w < p_h){
      w = width;
      h = p_h/p_w * width;
    }
    else{
      h = height;
      w = p_w/p_h * height;
    }
    console.log('In DisplayPhotoScreen render method.');
    console.log('Photo uri: ', photo.uri);

    return(
      <View style={styles.container}>
        <View style={{flex:0.9}} >
        <Image source={{uri: p_uri}} resizeMode='contain'
        style={{maxHeight: height, maxWidth: width, width: w, height: h}} />
        </View>

        <View style={{flex: 0.1, flexDirection:'row' }}>
    
        <TouchableHighlight onPress={() => this.deletePhoto(p_uri)}>
            <Image source={require('./images/delete.png')} 
            style={{width:30, height:30}} />
          </TouchableHighlight>  
        {this.renderCover(p_uri)} 
        </View>                       
      </View>

    );
  }
}

export default DisplayPhotoScreen;