import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore'
// import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'

let token = ''
const Login = ({ navigation }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [modalVisible, setModalVisible] = useState(false)


    const checkLogin = () => {
        if (email !== '' && password !== '') {
            setModalVisible(true)
            firestore()
                .collection('Users')
                .where('email', '==', email)
                .get()
                .then(querySnapshot => {
                    console.log(querySnapshot.docs)
                    setModalVisible(false)
                    if (querySnapshot.docs.length > 0) {
                        if (querySnapshot.docs[0]._data.email === email && querySnapshot.docs[0]._data.password === password) {
                            alert('User logged in successfully!')
                            // navigation.navigate('HomeScreen')
                            goToHome(
                                querySnapshot.docs[0]._data.userId, 
                                querySnapshot.docs[0]._data.name,
                                querySnapshot.docs[0]._data.email,
                                querySnapshot.docs[0]._data.profilePic)
                        }
                        else {
                            alert('Email or password may wrong!')
                        }
                        console.log(
                            querySnapshot.docs[0]._data.email + ' ' + querySnapshot.docs[0]._data.password,
                        )
                    }

                    else {
                        console.log('Account not found!')
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else{
            alert('Please enter email or password!')
        }
    }

    const goToHome = async (userId, name, email, profilePic) => {
        await AsyncStorage.setItem('USERID', userId)
        await AsyncStorage.setItem('NAME', name)
        await AsyncStorage.setItem('EMAIL', email)
        await AsyncStorage.setItem('PROFILE_PIC', profilePic)
        navigation.navigate('HomeScreen')
    }

    return (
        <View>
            <Text style={styles.text}>Login</Text>
            <View style={{ flexDirection: 'column', paddingTop: 20 }}>
                <View style={[styles.viewTextInput]}>
                    <Image style={styles.imageInput} source={require('../Images/mail.png')}/>
                    <TextInput onChangeText={(text) => { setEmail(text) }} value={email} placeholder='Email' style={styles.textInput} />
                </View>
                <View style={[styles.viewTextInput, { marginTop: 20 }]}>
                    <Image style={styles.imageInput} source={require('../Images/password.png')} />
                    <TextInput onChangeText={(pass) => { setPassword(pass) }} value={password} placeholder='Password' style={styles.textInput} secureTextEntry={true} />
                </View>
            </View>
            <TouchableOpacity style={styles.button}
                onPress={() => { checkLogin() }}>
                <Text style={{fontSize: 16, color: '#000'}}>Sign In</Text>
            </TouchableOpacity>
            <View style={styles.viewNewAccount}>
                <Text style={{ fontFamily: 'OpenSans-Medium', fontSize: 17, color: '#818181' }} >Don't have a account? </Text>
                <Text style={{ fontSize: 18, fontFamily: 'OpenSans-SemiBold', color: '#333' }}
                    onPress={() => {
                        navigation.navigate('Register')
                    }} >Sign Up</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'center',
        color: '#4169e1',
        marginTop: 100,
        fontSize: 20,
        fontWeight: '800',
    },
    viewTextInput: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 0.5,
        alignItems: 'center',
        backgroundColor: '#ededed',
        width: '90%',
        borderRadius: 10,
        height: 55,
        paddingLeft: 15,
    },
    imageInput: {
        width: 30,
        height: 30,
        borderRadius: 20,
    },
    textInput: {
        width: '84%',
        height: 50,
        paddingLeft: 15,
        borderRadius: 10,
        alignSelf: 'center',
        fontSize: 15,
    },
    viewNewAccount: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 30,
    },
    textNewAccount: {
        fontSize: 18,
        marginTop: 30,
        textDecorationLine: 'underline',
        alignSelf: 'center',
    },
    button: {
        width: '85%',
        height: 50,
        backgroundColor: '#4169e1',
        borderRadius: 10,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 15,
    },
})

export default Login