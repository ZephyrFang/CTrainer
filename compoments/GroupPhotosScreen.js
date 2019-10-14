import React, { Component } from 'react';
import { Image, ImageBackground, ScrollView, Text, Button, View, TouchableHighlight, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import styles from './styles';
import uuid from 'react-native-uuid';
//import AsyncStorage from '@react-native-community/async-storage';
import {AsyncStorage} from 'react-native';
import * as firebase from 'firebase';

//import * as GLOBAL from './global.js';
import { RetrieveData, StoreData, ConfirmAlert, AsyncAlert } from './helpers.js';


class GroupPhotosScreen extends Component {

  static navigationOptions = ({navigation}) => {
    return {      
      headerTitle: 'Group Photos',
      headerLeft: (
        <Button 
        onPress={() => navigation.push('Groups')}
        title='Groups'
        />
      ),
      headerRight: (

        <View style={{flex: 0.1, flexDirection:'row' }}>
          <TouchableHighlight style={{width: 50}} onPress={navigation.getParam('DeleteGroup')}>
            <Image source={require('./images/delete_red.png')} style={{width:25, height:25}} />
          </TouchableHighlight>  
          <TouchableHighlight style={{width: 50}} onPress={navigation.getParam('UploadGroup')}>
          <Image source={require('./images/upload.png')} style={{width:25, height:25}} />
        </TouchableHighlight>  
        </View>

      ),
    };
  }

  state = {
    //photos: [],
    cover: 0,
    group_id: 0,
    uploaded: false,
  }

  fetchData = () => {
    console.log('In fetchData method.')

    const { navigation } = this.props;

    var photos = navigation.getParam('photos', []);
    //console.log('photos.length from navigation: ', photos.length);
    //console.log('photos: ', photos);
     const cover = navigation.getParam('cover', 0);
     const uploaded = navigation.getParam('uploaded', 0);
     var group_id = navigation.getParam('group_id', 0);
     //const new_group = navigation.getParam('new_group', false);
     const add_photos = navigation.getParam('add_photos', false);
     console.log('add_photos: ', add_photos);

     this.setState({
       'group_id': group_id,
       uploaded: uploaded,
      });

     if (add_photos){
       //var ps = this.state.photos;
       
       console.log('add_photos is true, global.photos.length before push: ', global.photos.length);
       //ps.push(...photos);
       global.photos.push(...photos);
       console.log('ps.length after push: ', global.photos.length);
       //his.setState({photos: ps });
       this.updateGroup();
     }
     else{
       if ( photos.length > 0 ){
         console.log('setState photos');
        //this.setState({photos: photos});
        global.photos = photos;
       }       
     }

     if (group_id == 0){
       // New Group
       this.saveNewGroup(photos);
     }
     else{
       
       if (cover != 0 ){
         this.setState({'cover': cover});
       }
     }
  }

  componentWillMount(){
    // this.setGlobalState();
    this.fetchData();
    this.props.navigation.setParams({DeleteGroup: this._deleteGroup,});   
    this.props.navigation.setParams({UploadGroup: this._uploadGroup,});     
}

_deleteGroup = () => {

  console.log('In DeleteGroup method.')
  
  Alert.alert(
    'Alert',
    'Are you sure to delete this group?',
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
          var index = groups.findIndex(g => {
          //return g.id == global.group_id;
          return g.id == this.state.group_id;
          });

          if (index > -1){
            groups.splice(index, 1);
            global.groups = groups;
            StoreData('groups', groups);
            this.props.navigation.push('Groups');
      }           
        },
        style: 'destructive',
      },
    ],
    {cancelable: false},      
  ); 

  //console.log('I am here');   
}



  /*renderButton = () => {

    console.log('In renderButton method. global.group_id: ', global.group_id );   

    if ( global.group_id == 0 ){
      return(
        <Button title='Save New Group' onPress={() => this.saveNewGroup() } />
      );
    }
    else{
      return (
        
        <TouchableHighlight onPress={() => this.DeleteGroup()}>
        <Image source={require('./images/rubbish-bin.png')} 
        style={{width:30, height:30}} />
      </TouchableHighlight>       
      );      
    }
  }*/


  renderCover = (uri) => {
    //if ( global.cover == uri){
    if ( uri == this.state.cover ){
      return (
      <View style={{ ...styles.countBadge, backgroundColor: 'none' }}>
      <Image source={require('./images/gold-medal.png')} 
            style={{width:30, height:30}} />
    </View>  
      )   
    }    
  }

  saveNewGroup = (photos) => {
    /* Save new group to the device */

    console.log(' *** In GroupPhotosScreen saveNewGroup method.*********');    

    const group_id = uuid.v1();
    
    //global.group_id = group_id;
    //var photos = this.state.photos;
    //var photos = global.photos;
    //let photos = this.state.photos;
    //console.log('photos from parameter: ', photos);
    const cover = photos[0].uri;
    this.setState({
      group_id: group_id,
      cover: cover,
      uploaded: false,
    });

    
    let group = {
      id: group_id,
      photos: photos,
      cover: cover,
      uploaded: false,
    }
    
    global.groups.unshift(group);
    console.log('groups length: ', global.groups.length);

    StoreData('groups', global.groups);
  } 



  updateGroup = (uploaded=false) => {
    /* Update group photos */

    console.log(' *** In GroupPhotosScreen updateGroup method.*********');

    let groups = global.groups;

    let index = groups.findIndex(g => {
      //return g.id == global.group_id;
      return g.id == this.state.group_id;
    })

    if (index > -1){
      let group = groups[index];
      group.photos = global.photos;
      //group.photos = this.state.photos;
      if (uploaded){
        group.uploaded = true;
      }
      groups[index] = group;
      StoreData('groups', groups);
    }
  }

  uploadImage = async (uri, group_id, is_cover) => {
    console.log('>>>>>In uploadImage function.<<<<');

    //const uri = this.state.photo.uri;
    const n1 = uri.search("id=") + 3;
    console.log('n1: ', n1);

    const n2 = uri.search("&ext");
    console.log('n2: ', n2);

    var id = uri.substring(n1, n2);
    id = id + '?is_cover=' + is_cover;
    console.log('id: ', id);

    const response = await fetch(uri);
    const blob = await response.blob();

    var ref = firebase.storage().ref().child('groups/' + group_id + '/' + id);
    ref.put(blob).then((res) => {
      //console.log('Success: ', res);
      console.log('Success');
      return true;
    })
    .catch((error) => {
      console.log('Error: ', error)
      return false;
    })

  }

  _uploadGroup = () => {
    console.log(' *** In uploadPhotos method.*********');
    const group_id = this.state.group_id;
    let photos = global.photos;
    const cover = this.state.cover;
 
    var i;
    for ( i=0; i< photos.length; i++ ) {
      let p = photos[i];
      let is_cover = false;
      if ( p.uri == cover ){
        is_cover = true;
      }
      let result = this.uploadImage(p.uri, group_id, is_cover);
      if ( !result ) {
        return;
      }
    }

    // Todo: change this function to async await
    // these two lines excute always
    this.setState({ uploaded: true });
    this.updateGroup(true);    
  } 

  render() {
    
    console.log('In GroupPhotosScreen render method.');
    //this.setGlobalState();

    //console.log('global photos: ', global.photos);
    return (
      <View style={styles.container} >
             
        <View style={{flex:0.9}} >
              <ScrollView >
                  <View style={styles.imageGrid}>
                      {global.photos.map((p,i) => {
                        
                          return (
                            
                                <TouchableHighlight key={p.uri} onPress={() => {this.props.navigation.push('DisplayPhoto', {
                                  photo: p,
                                  //title: this.getTitle(p),
                                  cover: this.state.cover,
                                  group_id: this.state.group_id,

                                });
                                }} >
                                  <View>
                                      <ImageBackground key={i}
                                                style={ styles.image }
                                                source={{ uri: p.uri }} >            
                                      </ImageBackground>  
                                      {this.renderCover(p.uri)}                                     
                                  </View>                               
                                </TouchableHighlight>  
                         
                          );
                      })}
                      <TouchableHighlight  onPress={() => this.props.navigation.push('SelectPhotos', 
                      { 'add_photos': true, 
                      'group_id': this.state.group_id,
                      'cover': this.state.cover,
                      })}>
                        <Image style={styles.image} source={ require('./images/add.png') } />
                      </TouchableHighlight>
                      
                  </View>                  

              </ScrollView>
              </View>        
       
      </View>
    );
  }
}

export default GroupPhotosScreen;