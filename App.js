import React, {Component} from 'react';

import {
  AppRegistry,
  Text,
} from 'react-native';
import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import GuidePane from './GuidePane';

class RecentChatsScreen extends Component {
  render() {
    return <GuidePane />
  }
}

class AllContactsScreen extends Component {
  render() {
    return <Text>List of all contacts</Text>
  }
}

const MainScreenNavigator = StackNavigator({
  Recent: { screen: RecentChatsScreen },
  All: { screen: AllContactsScreen },
});

const AlphabetSoup = TabNavigator({
  Home: { screen: MainScreenNavigator },
  Chat: { screen: ChatScreen },
});

AppRegistry.registerComponent('AlphabetSoup', () => AlphabetSoup);
