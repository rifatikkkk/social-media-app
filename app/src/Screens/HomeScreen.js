import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Image } from 'react-native'
import React, { useState } from 'react'
import Home from '../Tabs/Home'
import Search from '../Tabs/Search'
import Add from '../Tabs/Add'
import Chat from '../Tabs/Chat'
import Profile from '../Tabs/Profile'

const HomeScreen = ({navigation}) => {
    const [selectedTab, setSelectedTab] = useState(0)

    return (
        <View style={{ flex: 1 }}>
            {selectedTab === 0 ? (<Home />) : selectedTab === 1 ? (<Search />) : selectedTab === 2 ? (<Add />) : selectedTab === 3 ? (<Chat />) : (<Profile />)}
            <View style={styles.view}>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => setSelectedTab(0)}>
                    <View style={styles.viewOnImage}>
                        <Image source={require('../Images/home.png')} style={[styles.image, { tintColor: selectedTab == 0 ? '#4169e1' : '#8E8E8E' }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => setSelectedTab(1)}>
                    <View style={styles.viewOnImage}>
                        <Image source={require('../Images/search.png')} style={[styles.image, { tintColor: selectedTab == 1 ? '#4169e1' : '#8E8E8E' }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => setSelectedTab(2)}>
                    <View style={styles.viewOnImage}>
                        <Image source={require('../Images/add.png')} style={[styles.image, { tintColor: selectedTab == 2 ? '#4169e1' : '#8E8E8E' }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => setSelectedTab(3)}>
                    <View style={styles.viewOnImage}>
                        <Image source={require('../Images/chat.png')} style={[styles.image, { tintColor: selectedTab == 3 ? '#4169e1' : '#8E8E8E' }]} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchOpacity} onPress={() => setSelectedTab(4)}>
                    <View style={styles.viewOnImage}>
                        <Image source={require('../Images/profile.png')} style={[styles.image, { tintColor: selectedTab == 4 ? '#4169e1' : '#8E8E8E' }]} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        position: 'absolute',
        bottom: 0,
        height: 70,
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    viewOnImage: {
        width: 40,
        height: 40,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    touchOpacity: {
        width: '20%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 24,
        height: 24,
    },
})

export default HomeScreen