import { AsyncStorage, Alert } from 'react-native'
import * as firebase from 'firebase';
import Resizer from 'react-image-file-resizer';
//import ImageResizer from 'react-image-file-resizer';


export async function RetrieveData (id){

    try {
      let value = await AsyncStorage.getItem(id);
      if (value !== null){
        //console.log(value);
        return value;
      }
      
    }
    catch (err){
      // Error retrieving data;
    }
  }

  export async function StoreData (id, item) {
    console.log(' *** In helpers.js storeData method.');
    
    try {
      await AsyncStorage.setItem(
        id, JSON.stringify(item)
      );
      //console.log('data stored on device: ', item);
    }
    catch(err){
      // Error saving data
    }
  }

  export function get_id_from_uri(uri) {
    var id;
    const n1 = uri.search("id=") + 3;
    console.log('n1: ', n1);

    const n2 = uri.search("&ext");
    console.log('n2: ', n2);

    var id = uri.substring(n1, n2);
    //id = id + '?is_cover=' + is_cover;
    console.log('id: ', id);
    return id;
  }

  export async function cloud_delete_photo (uri, group_id, is_cover, email) {
    /* Delete one photo from Cloud (Firebase Storage) */
    
    var id = get_id_from_uri(uri);

    var photo_name = id + '?is_cover=' + is_cover; 

    var ref = firebase.storage().ref().child('CurationTrainer/' + email + '/' + group_id + '/' + photo_name);
    ref.delete().then(() => {
      console.log('photo deleted from cloud.');
    })
    .catch((error) => {
      console.log('Error: ', error);
    })
  }

  export function cloud_delete_group (group_id, photos, cover, email ) {
    console.log('In cloud_delete_group function.');

    
    //let photos = global.photos;
    //const cover = this.state.cover;
    //const email = global.email;
 
    var i;
    for ( i=0; i< photos.length; i++ ) {
      let p = photos[i];
      let is_cover = false;
      if ( p.uri == cover ){
        is_cover = true;
      }
      let result = cloud_delete_photo(p.uri, group_id, is_cover, email);
      if ( !result ) {
        return;
      }
    }
  }

  export async function cloud_upload_photo (old_uri, group_id, is_cover, email) {
    /* Upload one photo to Cloud (Firebase Storage) */

    console.log('>>>>>In cloud_upload_photo function.<<<<');    
    //alert('In cloud_upload_photo, email is: ' + email);

    /* Resizer.imageFileResizer(
      old_uri,
      300,
      300,
      'JPEG',
      100,
      0,
   
      uri => {
        console.log('new_uri: ', uri)
    },
    'base64',
      ); */

     const response = await fetch(uri);
    const blob = await response.blob();

    var id = get_id_from_uri(uri);
    var photo_name = id + '?is_cover=' + is_cover;
    console.log('photo_name: ', photo_name);

    var ref = firebase.storage().ref().child('CurationTrainer/' + email + '/' + group_id + '/' + photo_name);
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

  export const AsyncAlert = async () => new Promise((resolve) => {
    Alert.alert(
      'info',
      'Message',
      [
        {
          text: 'ok',
          onPress: () => {
            resolve('YES');
          },
        },
      ],
      { cancelable: false },
    );
  });

  export async function ConfirmAlert ( alert_title, alert_text, cancel_text, ok_text) {

    console.log('In helper.ConfirmAlert function');
    var result;
    Alert.alert(
      alert_title,
      alert_text,
      [
        {
        text: cancel_text,
        onPress: () => {
          console.log('Cancel Pressed');
          result = false;          
        },
        style: 'cancel',
        },    
        {
          text: ok_text, 
          onPress: () => {
            console.log('Yes Pressed');
            result = true;             
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},      
    ); 

    console.log('result before return: ', result);
    return result;
  }

  
