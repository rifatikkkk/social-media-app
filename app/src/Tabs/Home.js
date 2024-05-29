import { View, StyleSheet, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused, useNavigation } from '@react-navigation/native'

let userId = ''
const Home = () => {

  const navigation = useNavigation()
  const [onLikeClick, setOnLikeClick] = useState(false)
  const isFocused = useIsFocused()
  const [postData, setPostData] = useState([])

  useEffect(() => {
    getUserId()
    getData()
  }, [onLikeClick])

  const getUserId = async () => {
    userId = await AsyncStorage.getItem('USERID')
    console.log(userId)
  }

  const getData = () => {
    let tempData = [];
    const subscriber = firestore()
      .collection('Posts')
      .get()
      .then(querySnapshot => {
        console.log('Total posts: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          tempData.push(documentSnapshot.data());
          console.log(
            'User ID: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          );
        });
        setPostData(tempData);
      });
    return () => subscriber();
  };

  const onLike = item => {
    let tempLikes = item.likes;
    if (tempLikes.length > 0) {
      console.log('length > 0')
      tempLikes.map(item1 => {
        if (userId === item1) {
          console.log('userId === item1')
          const index = tempLikes.indexOf(item1);
          if (index > -1) {
            console.log('index > -1')
            // only splice array when item is found
            tempLikes.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else {
          console.log('diliked');
          tempLikes.push(userId);
        }
      });
    } else {
      console.log('the end')
      tempLikes.push(userId);
    }

    console.log(tempLikes);
    firestore()
      .collection('Posts')
      .doc(item.postId)
      .update({
        likes: tempLikes,
      })
      .then(() => { })
      .catch(error => { });
    setOnLikeClick(!onLikeClick);
  };

  const getLikeStatus = likes => {
    let status = false
    likes.map(item => {
      if (item === userId) {
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
      <View style={styles.viewHeader}>
        <Text style={styles.textHeader}>Social App</Text>
      </View>
      {postData.length > 0 ? (
        <FlatList showsVerticalScrollIndicator={false} data={postData} renderItem={({ item, index }) => {
          return (
            <View style={[styles.viewPosts, { marginBottom: postData.length - 1 == index ? 70 : 0 }]}>
              <View style={styles.viewUser}>
                <Image style={styles.imageUser} source={{uri: item.image}} />
                <Text style={styles.nameUser}>{item.name}</Text>
              </View>
              <Text style={styles.textCaption}>{item.caption}</Text>
              <Image style={styles.imagePost} source={{ uri: item.image }} />
              <View style={styles.viewLikeComment}>
                <TouchableOpacity onPress={() => {
                  onLike(item)
                }}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={{ marginRight: 10, fontSize: 18 }}>
                    {item.likes.length}
                  </Text>
                  {getLikeStatus(item.likes) ? (
                    <Image
                      source={require('../Images/love.png')}
                      style={{ width: 24, height: 24, tintColor: 'red' }}
                    />
                  ) : (
                    <Image
                      source={require('../Images/heart.png')}
                      style={{ width: 24, height: 24 }}
                    />
                  )}
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                  navigation.navigate('Comment', {
                    postId: item.postId,
                    comments: item.comments,
                  })                  
                }}>
                  <Text style={{ marginRight: 10, fontSize: 18 }}>{item.comments.length}</Text>
                  <Image source={require('../Images/comment.png')}
                    style={styles.imageReaction} />
                </TouchableOpacity>
              </View>
            </View>
          )
        }} />
      ) : (
        <View style={styles.viewNoPosts}>
          <Text>No Posts found</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  viewHeader: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    paddingLeft: 20,
    backgroundColor: '#fff',
  },
  viewPosts: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  viewUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  viewNoPosts: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewLikeComment: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
  },
  imageUser: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 15,
  },
  nameUser: {
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '600',
    color: '#000',
  },
  textCaption: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
  imagePost: {
    width: '90%',
    height: 120,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  textHeader: {
    fontSize: 20,
    color: '#000',
    fontWeight: '700',
  },
  imageReaction: {
    width: 24,
    height: 24
  },
})

export default Home