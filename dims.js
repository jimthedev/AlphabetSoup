import React from 'react';
import {
  Dimensions
} from 'react-native';

var {height: deviceOriginalHeight, width: deviceOriginalWidth} = Dimensions.get('window');
var deviceOriginalOrientation =  orientation(deviceOriginalWidth, deviceOriginalHeight);

// Warning only tested on iOS so far
//
// Eventually will be react-native-dims
//
// USAGE:
//
// Set up state
// constructor(props) {
//   super(props);
//   this.state = {
//      ...deviceInitialDimensions
//   }
// }
// Listen for actual orientation changes
// <View onLayout={deviceOrientationDidChange.bind(this, () => {
//  // Normalized for human consumption so in landscape
//  // height is the short side, in portrait the long side
//  console.log(
//    this.state.deviceOrientation,
//    this.state.deviceWidth,
//    this.state.deviceHeight
//  );
// })}
//
//
// These properties get added to the state
var deviceInitialDimensions = {
  deviceOriginalWidth,
  deviceOriginalHeight,
  deviceOriginalOrientation,
  deviceWidth: deviceOriginalWidth,
  deviceHeight: deviceOriginalHeight,
  deviceOrientation: deviceOriginalOrientation,
};
function orientation(width, height) {
  return width > height ? 'landscape' : 'portrait';
}
function min(first, second) {
  if(first > second) {
    return second;
  } else {
    return first;
  }
}
function max(first, second) {
  if(first < second) {
    return second;
  } else {
    return first;
  }
}
// Internal function that determines if orientation has changed given
// a previous orientation.
function didDeviceOrientationChange(devicePreviousOrientation, deviceOrientationChangedCallback, deviceOrientationDidNotChangeCallback) {
  if(!devicePreviousOrientation) { throw new Error('Missing parameter in devicePreviousOrientation. Provide the previous orientation.') }
  var { height: deviceCurrentHeight, width: deviceCurrentWidth } = Dimensions.get('window')
  var deviceCurrentOrientation = orientation(deviceCurrentWidth, deviceCurrentHeight);
  if(devicePreviousOrientation !== deviceCurrentOrientation) {
    deviceOrientationChangedCallback({deviceWidth:deviceCurrentWidth, deviceHeight:deviceCurrentHeight, deviceOrientation: deviceCurrentOrientation});
  }
}

// This will mutate the state then trigger a callback.
// A user MUST bind this function explicitly as an onLayout
// handler. It uses this.setState so explicit binding is
// required.
//
function deviceOrientationDidChange(cb, evt) {
  const {deviceOrientation} = this.state;
  didDeviceOrientationChange(deviceOrientation, (newDimensions)=> {
    const {deviceWidth, deviceHeight, deviceOrientation} = newDimensions;
    this.setState({
      deviceWidth,
      deviceHeight,
      deviceOrientation
    }, cb);
  })
}

export {
  deviceInitialDimensions,
  deviceOrientationDidChange,
  min,
  max,
};
