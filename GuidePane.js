import React, {Component} from 'react';
import {
  Dimensions,
  Text,
  View
} from 'react-native';

import randomColor from 'randomcolor';
import styled from 'styled-components/native';
import {deviceInitialDimensions, deviceOrientationDidChange, min} from './dims.js';

// styled-components
const PanelScrollView = styled.ScrollView`
  min-height: 100;
  min-width: 100;
  flexDirection: column;
  flex: 1;
`;

const FullScreenView = styled.View`
  background-color: #fc0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;

const PanelText = styled.Text`
  font-size: 26;
  color: #ffcf5f;
`;


export default class GuidePane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...deviceInitialDimensions
    }
  }
  render() {
    return (
      <FullScreenView>
        <PanelScrollView onLayout={deviceOrientationDidChange.bind(this, () => {
          console.log(this.state);
        })} contentContainerStyle={{backgroundColor: 'blue', minWidth: this.state.deviceWidth, minHeight: this.state.deviceHeight}}>
            {/* <View style={{backgroundColor: 'orangered',flex:1,alignItems:'center',justifyContent:'center'}}>
              <PanelText>
                Original Device Dimensions
              </PanelText>
              <PanelText>
                {this.state.deviceOriginalWidth}x{this.state.deviceOriginalHeight} @ {this.state.deviceOriginalOrientation}
              </PanelText>
              <PanelText>
                Current Device Dimensions
              </PanelText>
              <PanelText>
                {this.state.deviceWidth}x{this.state.deviceHeight} @ {this.state.deviceOrientation}
              </PanelText>
            </View> */}
          <View style={{
            backgroundColor: 'orangered',
            flex:1,
            alignItems:'center',
            justifyContent:'center'
          }}>
              <PanelText>
                Alphabet Soup
              </PanelText>
          </View>
        </PanelScrollView>
      </FullScreenView>
    )
  }
}
