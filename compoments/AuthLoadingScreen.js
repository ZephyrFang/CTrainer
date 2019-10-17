//import React from 'react';
import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, StyleSheet, View } from 'react-native';

class AuthLoadingScreen extends Component {
    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {

        /* Fetch the token from storage then navigate to our appropriate place */
        const userId = await AsyncStorage.getItem('userId');
        alert('userId from device: ', userId);

         /* This will switch to the App screen or Auth screen and this loading screen will be unmounted and thrown away. */
         this.props.navigation.navigate(userId ? 'App' : 'Auth');
    }

    render() {
        return (
            <View>
                <ActivityIndicator />
                <StatusBar barStyle='default' />
            </View>
        )
    }
}

export default AuthLoadingScreen;