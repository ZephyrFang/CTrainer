import React, { Component } from 'react';
import { NavigationEvents } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import * as firebase from 'firebase';


//import { Image, ScrollView, Text, Button, StyleSheet, View, TouchableHighlight } from 'react-native';
//import CameraRoll from "@react-native-community/cameraroll";
//import CameraRollPicker from 'react-native-camera-roll-picker';
import SelectPhotosScreen from './compoments/SelectPhotosScreen';
import DisplayPhotoScreen from './compoments/DisplayOnePhotoScreen';
import GroupPhotosScreen from './compoments/GroupPhotosScreen';
import GroupsScreen from './compoments/GroupsScreen';


//import AlbumsScreen from './compoments/AlbumsScreen';
//import HomeScreen from './compoments/HomeScreen';
//import PickImageScreen from './compoments/PickImageScreen';
//import PickMultipleImagesScreen from './compoments/PickMultipleImagesScreen';
//import FullImagePickerScreen from './compoments/FullImagePickerScreen';

//import AlbumPhotosScreen from './compoments/AlbumPhotosScreen';

const RootNavigator = createStackNavigator(
  {
  //Home: HomeScreen,
  //ViewPhotos: ViewPhotosScreen,

  //SelectedPhotos: SelectedPhotosScreen,
  //Albums: AlbumsScreen,
  //AlbumPhotos: AlbumPhotosScreen,


  //ImagePickerExample: PickImageScreen,
  //PickMultipleImages: PickMultipleImagesScreen,
  //FullImagePicker: FullImagePickerScreen,
  Groups: GroupsScreen,
  GroupPhotos: GroupPhotosScreen,
  DisplayPhoto: DisplayPhotoScreen,
  SelectPhotos: SelectPhotosScreen,
  
  },
  {
  initialRouteName: 'Groups',
  }
);

const AppContainer = createAppContainer(RootNavigator);

export default class App extends Component {
  constructor(props){
    super(props);
    /* this.state = {
      isLoadingComplete: false,
    }*/

    var firebaseConfig = {
      apiKey: "AIzaSyAJf3sRERqf0zEvSy_or8HqxlPK2EBa_cY",
      authDomain: "happymoosecuration.firebaseapp.com",
      databaseURL: "https://happymoosecuration.firebaseio.com",
      projectId: "happymoosecuration",
      storageBucket: "happymoosecuration.appspot.com",
      messagingSenderId: "486031825786",
      appId: "1:486031825786:web:9c760614aec86d4745d4c3",
      measurementId: "G-QQH3PTGPPB"
    };

    // Initialize firebase...
    if ( !firebase.apps.length ) {
      firebase.initializeApp(firebaseConfig);
    }

  }
  render(){
    return <AppContainer />;
  }
}
