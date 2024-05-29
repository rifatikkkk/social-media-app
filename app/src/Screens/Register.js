import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid';

let token = ''
const Register = ({ navigation }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        getFcmToken()
    }, [])

    const getFcmToken = async () => {
        token = await messaging().getToken()
        console.log(token)
    }

    const saveData = () => {
        if (email !== '' && password !== '' && name !== '') {
            if (password.length <= 5) {
                alert('Password must contain 6 or more characters!')
            }
            else {
                setModalVisible(true)
                let id = uuidv4()
                firestore().collection('Users').doc(id).set({
                    email: email,
                    password: password,
                    name: name,
                    token: token,
                    userId: id,
                    followers: [],
                    following: [],
                    posts: [],
                    profilePic: '',
                    bio: '',
                    chatList: [],
                })
                    .then(() => {
                        console.log('User added')
                    })

                firestore().collection('Tokens').add({
                    token: token,
                })
                    .then(() => {
                        setModalVisible(false)
                        console.log('Token users added')
                        saveLocalData()
                    })
                setModalVisible(false)
                alert('User created!')
                navigation.goBack()
            }
        }
        else {
            alert('Please enter input field!')
        }
    }

    const saveLocalData = async () => {
        await AsyncStorage.setItem('NAME', name)
        await AsyncStorage.setItem('EMAIL', email)
    }
    return (
        <View>
            <Text style={styles.text}>Register</Text>
            <View style={{ flexDirection: 'column', paddingTop: 20 }}>
                <View style={[styles.viewTextInput]}>
                    <Image style={styles.imageInput} source={require('../Images/name.png')} />
                    <TextInput onChangeText={(name) => { setName(name) }} value={name} placeholder='Enter name' style={styles.textInput} />
                </View>
                <View style={[styles.viewTextInput, { marginTop: 20 }]}>
                    <Image style={styles.imageInput} source={require('../Images/mail.png')} />
                    <TextInput onChangeText={(text) => { setEmail(text) }} value={email} placeholder='Enter email' style={styles.textInput} />
                </View>
                <View style={[styles.viewTextInput, { marginTop: 20 }]}>
                    <Image style={styles.imageInput} source={require('../Images/password.png')} />
                    <TextInput onChangeText={(pass) => { setPassword(pass) }} value={password} placeholder='Enter password (6 or more char)' style={styles.textInput} />
                </View>
            </View>
            <TouchableOpacity style={styles.button}
                onPress={() => { saveData() }}>
                <Text style={{ fontSize: 15, color: '#000' }}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.viewNewAccount}>
                <Text style={{ fontFamily: 'OpenSans-Medium', fontSize: 17, color: '#818181' }} >Already have account? </Text>
                <Text style={{ fontSize: 18, fontFamily: 'OpenSans-SemiBold', color: '#333' }}
                    onPress={() => {
                        navigation.navigate('Login')
                    }} >Sign In</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        alignSelf: 'center',
        marginTop: 100,
        fontSize: 20,
        fontWeight: '800',
        color: '#4169e1',
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
        width: '84%',
        height: 50,
        backgroundColor: '#4169e1',
        borderRadius: 10,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
})

export default Register