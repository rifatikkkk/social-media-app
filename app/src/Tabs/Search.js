import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

let userId = ''
const Search = () => {
  const [usersList, setUsersList] = useState([])
  const [onFollowClick, setOnFollowClick] = useState(false)

  useEffect(() => {
    getData()
  }, [onFollowClick])

  const getData = async () => {
    let tempUsers = [];
    userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('Users')
      // Filter results
      // .where('userId', '==', userId)
      .get()
      .then(querySnapshot => {
        querySnapshot._docs.map(item => {
          if (item._data.userId !== userId) {
            tempUsers.push(item);
          }
        });
        setUsersList(tempUsers);
      });
  };

  const followUser = item => {

    let tempFollowers = item._data.followers
    let following = []
    let name = '';
    let profilePic = '';

    firestore()
      .collection('Users')
      .doc(userId)
      .get()
      .then(snapshot => {
        console.log('my data====>', item);
        following = snapshot.data().following;
        name = snapshot.data().name;
        profilePic = snapshot.data().profilePic;
        if (following.length > 0) {
          following.map(item2 => {
            if (item2.userId == item._data.userId) {
              let index2 = -1;
              following.map((x, i) => {
                if (x.userId == item._data.userId) {
                  index2 = i;
                }
              });
              if (index2 > -1) {
                following.splice(index2, 1);
              } else {
                following.push({
                  name: item._data.name,
                  userId: item._data.userId,
                  profilePic: item._data.profilePic,
                });
              }
            } else {
              following.push({
                name: item._data.name,
                userId: item._data.userId,
                profilePic: item._data.profilePic,
              });
            }
          });
        } else {
          following.push({
            name: item._data.name,
            userId: item._data.userId,
            profilePic: item._data.profilePic,
          });
        }
        console.log(following);
        if (tempFollowers.length > 0) {
          tempFollowers.map(item1 => {
            if (item1.userId == userId) {
              let index = -1;
              tempFollowers.map((x, i) => {
                if (x.userId == userId) {
                  index = i;
                }
              });

              if (index > -1) {
                tempFollowers.splice(index, 1);
              }
            } else {
              tempFollowers.push({
                name: name,
                userId: userId,
                profilePic: profilePic,
              });
            }
          });
        } else {
          tempFollowers.push({
            name: name,
            userId: userId,
            profilePic: profilePic,
          });
        }
        firestore()
          .collection('Users')
          .doc(item._data.userId)
          .update({
            followers: tempFollowers,
          })
          .then(res => {console.log(res)})
          .catch(error => {
            console.log(error);
          });
        firestore()
          .collection('Users')
          .doc(userId)
          .update({
            following: following,
          })
          .then(res => {console.log(res)})
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error)
      });

    setOnFollowClick(!onFollowClick);
    getData();
  }

  const getFollowStatus = followers => {
    let status = false;

    followers.map(item => {
      if (item.userId == userId) {
        status = true;
      } else {
        status = false;
      }
    });
    return status;
  };

  return (
    <View style={{ flex: 1 }} >
      <View style={styles.viewTitle}>
        <Text style={styles.textTitle}>Search</Text>
      </View>
      <FlatList data={usersList} renderItem={({ item, index }) => {
        return (
          <View style={styles.view}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={item._data.profilePic == '' ? require('../Images/user.png') : { uri: item._data.profilePic }} style={styles.imageProfile} />
              <Text style={{ fontSize: 18, fontWeight: '600' }}>{item._data.name}</Text>
            </View>
            <TouchableOpacity onPress={() => { followUser(item) }}
              style={styles.touchFollow}>
              <Text style={styles.textFollow}>{getFollowStatus(item._data.followers)
                    ? 'Unfollow'
                    : 'Follow'}</Text>
            </TouchableOpacity>
          </View>
        )
      }} />
    </View>
  )
}

const styles = StyleSheet.create({
  view: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  imageProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 20,
    marginRight: 10,
  },
  touchFollow: {
    marginRight: 20,
    backgroundColor: '#0099ff',
    height: 35,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textFollow: {
    color: '#fff',
    marginLeft: 10,
    marginRight: 10,
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

export default Search