import React, { Component } from 'react';
//import { IText, Button, View, TouchableHighlight, FlatList, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { Item, Form, Input, Button, Label, Container, Text } from 'native-base';
import * as firebase from 'firebase';
import styles from './styles';

class AuthenticationScreen extends Component{

    state = {
        email: '',
        password: ''
    }

    SignIn = ( email, password ) => {
        try {
            firebase.auth().signInWithEmailAndPassword(email, password);
            firebase.auth().onAuthStateChanged(user => {
                alert(user.email);
            })
        }
        catch (error){
            console.log(error.toString(error));
        }
    }

    SignUp = ( email, password ) => {
        try {
            firebase.auth().createUserWithEmailAndPassword(email, password);
        }
        catch (error) {
            console.log(error.toString(error));
        }
    }

    render() {
        return (
            <Container style={styles.authentication_container}>
                <Form>
                    <Item floatingLabel>
                        <Label>Email</Label>
                        <Input autoCapitalize='none'
                               autoCorrect={false} 
                               onChangeText={email => this.setState({email})}
                        />
                    </Item>

                    <Item>
                        <Label>Password</Label>
                        <Input secureTextEntry={true}
                               autoCapitalize='none'
                               autoCorrect={false}
                               onChangeText={password => this.setState({password})}                               
                        />
                    </Item>

                    <Button full rounded onPress={ () => this.SignIn(this.state.email, this.state.password)}>
                        <Text>SignIn</Text>
                    </Button>
                    <Button full rounded success style={{ marginTop: 20 }}
                            onPress={() => this.SignUp( this.state.email, this.state.password )}
                    >
                        <Text>Signup</Text>
                    </Button>
                </Form>
            </Container>
        );
    }
}

export default AuthenticationScreen;