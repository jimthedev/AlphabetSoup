import React, {Component} from 'react';
import {
  Text,
  View,
} from 'react-native';
import RedButton from './RedButton';

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>Hello, Navigation!</Text>
        <RedButton title='Hi' onPress={() => {
          console.log('yo');
          navigate('Chat', { user: 'Lucy' })
        }} />
      </View>
    )
  }
}
