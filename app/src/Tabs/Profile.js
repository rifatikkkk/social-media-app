import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { useNavigation } from '@react-navigation/native'


const Profile = () => {
  let userId = null
  let chatRec = []
  const navigation = useNavigation()
  const [imageData, setImageData] = useState(null)
  const [imagePicked, setImagePicked] = useState(false)
  const [uploadedPicUrl, setUploadedPicUrl] = useState('')

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const [selectedTab, setSelectedTab] = useState(0)

  const [chatList, setChatList] = useState([])
  const [chatListRec, setChatListRec] = useState([])

  const [userName, setUserName] = useState('')
  const [recUserName, setRecUserName] = useState('')

  const [profilePicRec, setProfilePicRec] = useState('')

  useEffect(() => {
    getProfileData()
  }, [])

  const getProfileData = async () => {
    //  Получаем даныне главного пользователя
    userId = await AsyncStorage.getItem('USERID')
    firestore().collection('Users').doc(userId).get().then(documentSnapshot => {
      console.log('User exists: ', documentSnapshot.exists)
      if (documentSnapshot.exists) {
        console.log('User data: ', documentSnapshot.data())
        setUploadedPicUrl(documentSnapshot.data().profilePic)
        setFollowers(documentSnapshot.data().followers)
        setFollowing(documentSnapshot.data().following)
        setChatList(documentSnapshot.data().chatList)
        setUserName(documentSnapshot.data().name)
        console.log(userId)
      }
    })
    //  Данные пользователя получены
  }

  const goToAuth = async () => {
    await AsyncStorage.removeItem('USERID');
    await AsyncStorage.removeItem('NAME');
    await AsyncStorage.removeItem('PROFILE_PIC');
    await AsyncStorage.removeItem('RECID');
    await AsyncStorage.removeItem('EMAIL');
    navigation.navigate('Login')
  }



  const goMessage = async (receiverId, recName, recPic) => {
    //  Get Data User and Receiver
    const userId = await AsyncStorage.getItem('USERID')
    const recId = await AsyncStorage.getItem('RECID')

    
    firestore().collection('Users').doc(recId).get().then(documentSnapshot => {
      console.log('Receiver exists: ', documentSnapshot.exists)
      if (documentSnapshot.exists) {
        console.log('Receiver data: ', documentSnapshot.data())
        chatRec = documentSnapshot.data().chatList
        console.log(chatRec)
        // setChatListRec(chatRec)
        // console.log(chatListRec)
      }
    })


    // If chatList User = 0
    if (chatList.length == 0) {
      console.log('Length is null')

      let tempChatList = chatList
      tempChatList.push({
        numChat: `${userId}_${recId}`,
        userId: userId,
        name: userName,
        profilePicUser: uploadedPicUrl,
        recId: recId,
        recName: recName,
        profilePicRec: recPic,
      })
      firestore().collection('Users').doc(userId).update({
        chatList: tempChatList,
      })
        .then(() => {
          console.log('ChatList User added')
        })
        .catch(error => { console.log(error) })

      let tempChatListRec = chatRec
      console.log(tempChatListRec)
      tempChatListRec.push({
        numChat: `${userId}_${recId}`,
        userId: recId,
        name: recName,
        profilePicUser: recPic,
        recId: userId,
        recName: userName,
        profilePicRec: uploadedPicUrl,
      })

      firestore().collection('Users').doc(recId).update({
        chatList: tempChatListRec,
      }).then(() => {
        console.log("ChatList Rec added", tempChatListRec)
      })
        .catch(error => { console.log(error) })

      navigation.navigate('NewMessage', {
        data: {
          numChat: `${userId}_${recId}`,
          userId: userId,
          name: userName,
          profilePicUser: uploadedPicUrl,
          recId: recId,
          recName: recName,
          profilePicRec: recPic,
        },
      });
    }
    else {
      chatList.forEach(entry => {
        if (`${userId}_${recId}` == entry.numChat || `${recId}_${userId}` == entry.numChat) {
          console.log('Trueeeeee')
          navigation.navigate('NewMessage', {
            data: {
              numChat: entry.numChat,
              userId: userId,
              name: userName,
              profilePicUser: uploadedPicUrl,
              recId: recId,
              recName: recName,
              profilePicRec: recPic,
            },
          });
        }
        else {
          let tempChatList = chatList
          tempChatList.push({
            numChat: `${userId}_${recId}`,
            userId: userId,
            name: userName,
            profilePicUser: uploadedPicUrl,
            recId: recId,
            recName: recName,
            profilePicRec: recPic,
          })
          firestore().collection('Users').doc(userId).update({
            chatList: tempChatList,
          })
            .then(() => {
              console.log('ChatList User added')
            })
            .catch(error => { console.log(error) })

          let tempChatListRec = chatRec
          tempChatListRec.push({
            numChat: `${userId}_${recId}`,
            userId: recId,
            name: recName,
            profilePicUser: recPic,
            recId: userId,
            recName: userName,
            profilePicRec: uploadedPicUrl,
          })

          firestore().collection('Users').doc(recId).update({
            chatList: tempChatListRec,
          }).then(() => {
            console.log("Chat list Rec added: ", tempChatListRec)
          })
            .catch(error => { console.log(error) })


          navigation.navigate('NewMessage', {
            data: {
              numChat: `${userId}_${recId}`,
              userId: userId,
              name: userName,
              profilePicUser: uploadedPicUrl,
              recId: recId,
              recName: recName,
              profilePicRec: recPic,
            },
          });
        }
      })
    }
  }

  let options = {
    saveToPhotos: true,
    mediaType: 'photo',
  }

  // const openCamera = async () => {
  //   const result = await launchCamera(options)
  //   setImageData(result)
  //   console.log(result)
  // }

  const openGallery = async () => {
    const result = await launchImageLibrary(options)
    setImageData(result)
    console.log(result)
    setImagePicked(true)
  }

  const uploadProfilePic = async () => {
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    saveProfileToStore(url)
  }

  const saveProfileToStore = async url => {
    const userId = await AsyncStorage.getItem('USERID')
    firestore().collection('Users').doc(userId).update({
      profilePic: url,
    })
      .then(() => {
        console.log('Profile updated')
        setImagePicked(false)
      })
      .catch((error) => { console.log(error) })
      await AsyncStorage.setItem('PROFILE_PIC', url)
    alert('Updated successfully!')
    setImagePicked(false)
    getProfileData()
  }

  const getFollowStatus = followers => {
    let status = false
    followers.map(item => {
      if (item.userId == userId) {
        status = true
      }
      else {
        status = false
      }
    })
    return status
  }

  return (
    <View style={{ flex: 1 }} >
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>Profile</Text>
        <Text style={[styles.textTitle, { color: '#4169e1' }]} onPress={() => {
          goToAuth();
        }}>Sign Out</Text>
      </View>

      <TouchableOpacity style={styles.picTouchable}>
        {imagePicked == true ? (
          <Image
            source={{ uri: imageData.assets[0].uri }}
            style={styles.picProfile}
          />
        ) : uploadedPicUrl === '' ? (
          <Image
            source={require('../Images/user.png')}
            style={styles.picProfile}
          />
        ) : (
          <Image
            source={{ uri: uploadedPicUrl }}
            style={styles.picProfile}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.editTouchable} onPress={() => {
        if (imagePicked === false) {
          openGallery()
        }
        else {
          uploadProfilePic()
        }
      }}>
        <Text style={{ color: '#4169e1' }}>{imagePicked ? 'Save picture' : 'Edit profile'}</Text>
      </TouchableOpacity>

      <View style={styles.viewTitleFollow}>
        <TouchableOpacity onPress={() => { setSelectedTab(0) }}
          style={[styles.touchFollow, { backgroundColor: selectedTab == 0 ? '#fff' : '#C0C0C0' }]}>
          <Text>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setSelectedTab(1) }}
          style={[styles.touchFollow, { backgroundColor: selectedTab == 1 ? '#fff' : '#C0C0C0' }]}>
          <Text>Following</Text>
        </TouchableOpacity>
      </View>
      {selectedTab == 0 ? null : (
        <FlatList data={following} renderItem={({ item, index }) => {
          return (
            <View style={styles.viewFollow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={item.profilePic == ''
                    ? require('../Images/user.png')
                    : { uri: item.profilePic }}
                  style={styles.imageFollow} />
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={async() => {
                  recId = await AsyncStorage.setItem('RECID', item.userId)
                  goMessage(item.userId, item.name, item.profilePic)
                  console.log(item.userId, item.name, item.profilePic)
                }}>
                <Image
                  source={require('../Images/chat.png')}
                  style={{ width: 24, height: 24, tintColor: '#4169e1' }}
                />
              </TouchableOpacity>
            </View>
          )
        }}>

        </FlatList>
      )}
      {selectedTab == 1 ? (null) : (
        <FlatList data={followers} renderItem={({ item, index }) => {
          return (
            <View style={styles.viewFollow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={item.profilePic == ''
                    ? require('../Images/user.png')
                    : { uri: item.profilePic }}
                  style={styles.imageFollow} />
                <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={async () => {
                  recId = await AsyncStorage.setItem('RECID', item.userId)
                  goMessage(item.userId, item.name, item.profilePic)
                  console.log(item.userId, item.name, item.profilePic)
                }}>
                <Image
                  source={require('../Images/chat.png')}
                  style={{ width: 24, height: 24, tintColor: '#4169e1' }}
                />
              </TouchableOpacity>
            </View>
          )
        }}>

        </FlatList>
      )}
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
  picTouchable: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picProfile: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  editTouchable: {
    width: 200,
    height: 40,
    borderWidth: 0.7,
    alignSelf: 'center',
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTitleFollow: {
    width: '100%',
    height: 60,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
  },
  touchFollow: {
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFollow: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  imageFollow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  imageChat: {
    width: 24,
    height: 24,
    tintColor: 'orange',
  },
})

export default Profile