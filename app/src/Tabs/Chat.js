import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

let myId = ''
const Chat = () => {
  const [chatList, setChatList] = useState([])
  const navigation = useNavigation()

  useEffect(() => {
    getAllChats()
  }, [])

  const getAllChats = async () => {
    myId = await AsyncStorage.getItem('USERID')
    console.log(myId)
    firestore().collection('Users').doc(myId).onSnapshot(documentSnapshot => {
      console.log(documentSnapshot)
      setChatList(documentSnapshot._data.chatList)
    })
    chatList.forEach(entry => {
      firestore().collection('Chats')
        .doc(entry)
        .collection('Messages').get().then(documentSnapshot => {
          if (documentSnapshot.exists == true) {

          }
        })
    })
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>Chat</Text>
      </View>
      {chatList.length != 0 ? (
        <FlatList
          data={chatList}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity style={styles.touchOpac}
                onPress={async () => {
                  await AsyncStorage.setItem('RECID', item.recName)
                  navigation.navigate('NewMessage', {
                    data: {
                      numChat: item.numChat,
                      profilePicUser: item.profilePicRec,
                      userId: item.recId,
                    }
                  })
                }}>
                {item.profilePicRec != '' || item.profilePicRec != null ? (
                  <Image source={{ uri: item.profilePicRec }} style={styles.picProfile} />
                ) : (
                  <Image source={require('../Images/user.png')} style={styles.picProfile} />
                )}
                <Text style={{ marginLeft: 20, fontSize: 18 }}>{item.recName}</Text>
              </TouchableOpacity>
            )
          }}
        />
      ) : (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{fontSize: 18}}>There are currently no dialogues!</Text>
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  touchOpac: {
    width: '95%',
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#828282',
    backgroundColor: '#fff',
  },
  picProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
  },
  viewTitle: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#8e8e8e',
    alignItems: 'center',
  },
  textTitle: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: '600',
    marginRight: 15,
  },
})

export default Chat