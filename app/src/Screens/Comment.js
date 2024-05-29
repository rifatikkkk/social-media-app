import { View, Text, TextInput, StyleSheet, FlatList, Image } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useRoute } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'


let userId = ''
let comments = []
let postId = ''
let name = ''
let profilePic = ''

const Comment = ({ navigation }) => {
  const route = useRoute()
  const [comment, setComment] = useState('')
  const inputRef = useRef()
  const [commentList, setCommentList] = useState([])
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    getData()
    comments = route.params.comments
    setCommentList(comments)
    postId = route.params.postId
  }, [])

  const getData = async () => {
    userId = await AsyncStorage.getItem('USERID')
    name = await AsyncStorage.getItem('NAME')
    profilePic = await AsyncStorage.getItem('PROFILE_PIC')
  }

  const sendComment = () => {
    let tempComments = comments
    tempComments.push({
      userId: userId,
      comment: comment,
      postId: postId,
      name: name,
      profile: profilePic,
    })
    firestore().collection('Posts').doc(postId).update({
      comments: tempComments,
    })
      .then(() => {
        console.log('Comment added')
      })
      .catch(error => { console.log(error) })
    inputRef.current.clear()
    setModalVisible(!modalVisible)
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.viewTitle}>
        <Text style={[styles.textTitle, { color: '#000' }]}>Comments</Text>
        <Text style={[styles.textTitle, { color: '#4169e1' }]} onPress={() => { navigation.goBack() }}>Back</Text>
      </View>

      <FlatList data={commentList} renderItem={({ item, index }) => {
        return (
          <View style={styles.viewComment}>
            {
              item.profile == null ? (
                <Image style={styles.imageProfileComment} source={require('../Images/profile.png')} />
              ) : (
                <Image style={styles.imageProfileComment} source={{ uri: item.profile }} />
              )
            }
            <View>
              <Text style={{ fontSize: 14, fontWeight: '600' }}>{item.name}</Text>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', marginTop: 3 }}>{item.comment}</Text>
            </View>
          </View>
        )
      }} />

      <View style={styles.view}>
        <TextInput ref={inputRef} value={comment} onChangeText={(txt) => { setComment(txt) }} style={styles.textInput} placeholder='type comment here' />
        <Text onPress={() => { sendComment() }} style={styles.send}>Send</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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
  view: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  viewComment: {
    width: '100%',
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
  },
  imageProfileComment: {
    width: 40,
    height: 40,
    marginLeft: 10,
    marginRight: 15,
    borderRadius: 20,
  },
  textInput: {
    marginLeft: 10,
    width: '80%'
  },
  send: {
    marginRight: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#4169e1'
  },
})

export default Comment