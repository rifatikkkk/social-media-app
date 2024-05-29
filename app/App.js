import { LogBox } from 'react-native'
import React from 'react'
import AppNavigator from './src/AppNavigator'
import 'react-native-get-random-values';


const App = () => {
  LogBox.ignoreAllLogs()
  return (
    <AppNavigator/>
  )
}

export default App