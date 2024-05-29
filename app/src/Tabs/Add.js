import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import storage from '@react-native-firebase/storage'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'

let token = ''
let name = ''
let email = ''
const Add = ({ onAdded }) => {
  const [imageData, setImageData] = useState(null)
  const [caption, setCaption] = useState('')
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    getFcmToken()
  }, [])

  const getFcmToken = async () => {
    // token = await messaging().getToken()
    name = await AsyncStorage.getItem('NAME')
    email = await AsyncStorage.getItem('EMAIL')
    // console.log(token)
  }

  let options = {
    saveToPhotos: true,
    mediaType: 'photo',
  }

  const openCamera = async () => {
    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.CAMERA,
    // )
    // if (granted === PermissionsAndroid.RESULTS.CAMERA) {
    // }
    const result = await launchCamera(options)
    if (result.didCancel) {
      console.log('Error!')
    }
    else {
      setImageData(result)
      console.log(result)
    }
  };
  const openGallery = async () => {
    const result = await launchImageLibrary(options);
    if (result.didCancel) {
      console.log('Error!')
    }
    else {
      setImageData(result);
      console.log(result);
    }
  };

  const uplaodImage = async () => {
    setModalVisible(true);
    let id = uuidv4();
    const reference = storage().ref(imageData.assets[0].fileName);
    const pathToFile = imageData.assets[0].uri;
    const userId = await AsyncStorage.getItem('USERID');
    // uploads file
    await reference.putFile(pathToFile);
    const url = await storage()
      .ref(imageData.assets[0].fileName)
      .getDownloadURL();
    console.log(url);
    firestore()
      .collection('Posts')
      .doc(id)
      .set({
        image: url,
        caption: caption,
        email: email,
        name: name,
        userId: userId,
        postId: id,
        likes: [],
        comments: [],
      })
      .then(() => {
        console.log('Post added!');
        alert('Post added!')
      })
      .catch(error => {
        setModalVisible(false);
      });
  };


  return (
    <View style={{ flex: 1 }} >
      <View style={styles.viewHeader}>
        <Text style={{ fontSize: 20, color: '#000', marginLeft: 20 }}>Add Post</Text>
        <Text style={{ fontSize: 18, color: imageData !== null ? 'blue' : '#8E8E8E', marginRight: 20 }}
          onPress={() => {
            if (imageData != null || caption !== "") {
              uplaodImage()
            }
            else {
              alert('Please Select Pictures or Write Caption!')
            }
          }}>Upload</Text>
      </View>
      <View style={styles.viewMain}>
        {imageData !== null ? (
          <Image source={{ uri: imageData.assets[0].uri }} style={styles.image} />
        ) : (
          <Image source={require('../Images/image.png')} style={styles.image} />
        )}
        <TextInput value={caption} onChangeText={(txt) => { setCaption(txt) }} placeholder='type Caption here...' style={{ width: '70%', }} />
      </View>

      <TouchableOpacity style={styles.touchOpacity} onPress={() => { openCamera() }}>
        <Image source={require('../Images/camera.png')} style={styles.selectOption} />
        <Text style={{ marginLeft: 20 }}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.touchOpacity} onPress={() => { openGallery() }}>
        <Image source={require('../Images/gallery.png')} style={styles.selectOption} />
        <Text style={{ marginLeft: 20 }}>Open Gallery</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  viewHeader: {
    width: '100%',
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 6,
  },
  viewMain: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    height: 150,
    borderWidth: 0.5,
    borderColor: '#8E8E8E',
    borderRadius: 10,
    flexDirection: 'row',
  },
  touchOpacity: {
    width: '100%',
    height: 50,
    borderBottomWidth: 0.2,
    borderBottomColor: '#8E8E8E',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
    margin: 10,
  },
  selectOption: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
})

export default Add