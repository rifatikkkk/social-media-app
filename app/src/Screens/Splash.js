import {
    View, 
    Text, 
    StyleSheet,
    StatusBar, 
    Image
} from 'react-native'
import React, { useEffect } from 'react'
// import Sound from 'react-native-sound'

const Splash = ({ navigation }) => {

    // let control
    // let music = require('../Song/backgroundMusic.mp3')
    // Sound.setCategory('Playback', true)

    useEffect(() => {
        // playSound()
        setTimeout(() => {
            // stopSound()
            navigation.navigate('Login')
        }, 5000);
    })

    // const playSound = () => {
    //     control = new Sound(music, (error, _sound) => {
    //         if (error) {
    //             console.log('Error: ', error)
    //             return
    //         }
    //         control.play(() => {
    //             control.release()
    //             console.log('Music start!')
    //         })
    //     })
    // }

    // const stopSound = () => {
    //     control.stop(() => {
    //         control.release()
    //         console.log('Stop playing!')
    //     })
    // }

    return (
        <View style={styles.view}>
            <StatusBar barStyle='light-content' hidden={false} backgroundColor='#465bd8' />
            <Image source={require('../Images/splash.png')} style={styles.image} />
            <Text style={styles.text}>Social App</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: '#4169e1',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    text: {
        fontSize: 30,
        color: '#fff',
        fontFamily: 'OpenSans-Bold',
    },
})

export default Splash