import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Screens/Splash';
import Login from './Screens/Login';
import Register from './Screens/Register';
import HomeScreen from './Screens/HomeScreen';
import Comment from './Screens/Comment';
import NewMessage from './Chat/NewMessage';
import Message from './Chat/Message';
import MyMessage from './Chat/MyMessage';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name='Splash'
                    component={props => <Splash {...props} />}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Login'
                    component={props => <Login {...props} />}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Register'
                    component={props => <Register {...props} />}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='HomeScreen'
                    component={props => <HomeScreen {...props} />}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Comment'
                    component={props => <Comment {...props} />}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name='Message'
                    component={Message}
                    options={{ headerShown: false }} />
                <Stack.Screen
                    name="MyMessage"
                    component={MyMessage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NewMessage"
                    component={NewMessage}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator