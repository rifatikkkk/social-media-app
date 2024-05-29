import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Bubble, GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { useRoute } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

let userId = null
let recId = null
const NewMessage = () => {
    const [messages, setMessages] = useState([])
    const route = useRoute()


    useEffect(() => {
        getProfileData()
        const querySnapShot = firestore()
            .collection('Chats')
            .doc(route.params.data.numChat)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
        querySnapShot.onSnapshot(snapShot => {
            const allMessages = snapShot.docs.map(snap => {
                return { ...snap.data(), createdAt: new Date() }
            })
            setMessages(allMessages)
        })
    }, [])

    const getProfileData = async () => {
        userId = await AsyncStorage.getItem('USERID')
        recId = await AsyncStorage.getItem('RECID')
        console.log(route.params.data.profilePicUser)
    }

    const onSend = messageArray => {
        console.log(messageArray)
        const msg = messageArray[0]
        console.log(userId)
        const myMsg = {
            ...msg,
            senderId: userId,
            receiverId: route.params.data.userId,
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, myMsg))
        firestore().collection('Chats').doc(route.params.data.numChat).collection('Messages').add({
            ...myMsg,
            createdAt: firestore.FieldValue.serverTimestamp(),
        })
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <GiftedChat messages={messages} onSend={messages => onSend(messages)}
                user={{
                    _id: userId,
                }}
                renderBubble={props => {
                    return (
                        <Bubble {...props} wrapperStyle={{
                            right: {
                                backgroundColor: '#4169e1',
                            },
                        }}
                        />
                    )
                }} />
        </View>
    )
}

export default NewMessage