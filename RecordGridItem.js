import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from 'react-native';
import RedButton from './RedButton';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RecordGridItem extends Component {
  state = {
    clickedAlert:false,
    recording: false,
    stoppedRecording: false,
    finished: false,
    cleared: true,
    audioPath: '',
    hasPermission: undefined,
  };
  _play() {
    const {label} = this.props;
    console.log(label + ': attemping to play');
    if (this.props.isSelfRecording) {
      return;
      //this.props.stopRecording();
    }
    this.setState({
      playing: true
    }, () => {
      console.log(label + ': letting the parent know that I am recording');
      this.props.startPlaying();
    })

    setTimeout(()=> {
      //alert('playing ' + this.props.audioPath);
      console.log(label + ': loading url: ' + this.props.audioPath);
      var sound = new Sound(this.props.audioPath, '', (error, soundProps) => {
        console.log(label + ': new Sound callback fired');
        console.log(error);
        console.log(soundProps);
        if (error != null) {
          alert(label + ':failed to load the sound', error);
        }
      });
      
      setTimeout(() => {
        console.log(label + ':about to actually play, finally')
        sound.play((success) => {
          console.log(label + ': play callback triggered')
          if (success) {
             console.log(label + ': successfully finished playing');
             this.setState({playing: false}, () => {
               console.log(label + ': letting parent know we are done playing');
               this.props.stopPlaying();
             })
           } else {
             console.log(label + ': playback failed due to audio decoding errors');
           }
        });
      }, 300)
    },100)
  }
  _showFilePath() {
    this.setState({clickedAlert: true});
  }
  _debugRenderBoolean(label, value) {
    return <Text>{label}: {value ? 'true': 'false'}</Text>
  }
  render() {
    const {
      audioPath,
      label,
      isSelfRecording,
      isOtherRecording,
      playingAvailable,
      startRecording,
      stopRecording,
      hasFinishedRecording,
      isSelfPlaying,
      isOtherPlaying } = this.props;
    const { recording, finished, cleared, playing } = this.state;
    return (
      <View style={{
        backgroundColor: '#efefef',
        width: 100,
        height: 100,
        margin: 10,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
      }}>
        <View>
          <Text style={{
            fontSize: 80,
            textAlign:'center',
            color: '#4f4f4f',
          }}>{label}</Text>
        </View>
        <View style={{
          alignItems:'center',
          justifyContent:'center',
          flexDirection:'column'}}>
          <Icon name="microphone"
            size={30}
            color={isOtherRecording ? '#ccc': (isSelfRecording ? 'red': ((isOtherPlaying || isSelfPlaying) ? '#ccc':'#4f4f4f'))}
            onPress={isSelfRecording ? stopRecording.bind(this) : startRecording.bind(this) } />
          <Icon
            name="play-circle"
            size={30}
            color={playing ? '#00cc00' : ((isSelfRecording || isOtherRecording)? '#ccc' : (hasFinishedRecording ? '#4d4d4d' : '#ccc'))}
            onPress={hasFinishedRecording ? this._play.bind(this) : null } />
        </View>
      </View>
    )
  }
}
