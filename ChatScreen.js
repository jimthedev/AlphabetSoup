import React, {Component} from 'react';
import {
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import RedButton from './RedButton';
import RecordGridItem from './RecordGridItem';
import {AudioRecorder, AudioUtils} from 'react-native-audio';
import StatusBarAlert from 'react-native-statusbar-alert';
import {deviceInitialDimensions, deviceOrientationDidChange, min} from './dims.js';
import uuid from 'uuid/v4';

export default class ChatScreen extends Component {
  static navigationOptions = {
    title: 'Chat',
  };
  state = {
    ...deviceInitialDimensions,
    items: [
      {
        id: uuid(),
        label: 'A',
      },
      {
        id: uuid(),
        label: 'B'
      },
      {
        id: uuid(),
        label: 'C'
      },
      {
        id: uuid(),
        label: 'D'
      },
      {
        id: uuid(),
        label: 'E'
      },
      {
        id: uuid(),
        label: 'F'
      },
      {
        id: uuid(),
        label: 'G'
      },
      {
        id: uuid(),
        label: 'H'
      },
      {
        id: uuid(),
        label: 'I'
      },
      {
        id: uuid(),
        label: 'J'
      },
      {
        id: uuid(),
        label: 'K'
      },
      {
        id: uuid(),
        label: 'L'
      },
      {
        id: uuid(),
        label: 'M'
      },
      {
        id: uuid(),
        label: 'N'
      },
      {
        id: uuid(),
        label: 'O'
      },
      {
        id: uuid(),
        label: 'P'
      },
      {
        id: uuid(),
        label: 'Q'
      },
      {
        id: uuid(),
        label: 'R'
      },
      {
        id: uuid(),
        label: 'S'
      },
      {
        id: uuid(),
        label: 'T'
      },
      {
        id: uuid(),
        label: 'U'
      },
      {
        id: uuid(),
        label: 'V'
      },
      {
        id: uuid(),
        label: 'W'
      },
      {
        id: uuid(),
        label: 'X'
      },
      {
        id: uuid(),
        label: 'Y'
      },
      {
        id: uuid(),
        label: 'Z'
      },
    ],
//    clickedAlert:false,
//     currentTime: 0.0,
//     stoppedRecording: false,
//     finished: false,
    recording: false,
    finishedRecorderIDs: [],
    playingIDs: [],
    cleared: true,
    audioPath: AudioUtils.DocumentDirectoryPath + '/test.mpeg_4',
    baseAudioPath: AudioUtils.DocumentDirectoryPath,
    hasPermission: undefined,
  };
  prepareRecordingPath(audioPath){
    AudioRecorder.prepareRecordingAtPath(audioPath, {

      SampleRate: 44100,
      Channels: 2,
      AudioEncoding: 'ima4',
      OutputFormat: 'mpeg_4',
      AudioQuality: "High",
      AudioEncodingBitRate: 32000

      // // Or for low quality:
      // SampleRate: 22050,
      // Channels: 1,
      // AudioQuality: "Low",
      // AudioEncoding: "aac",
      // AudioEncodingBitRate: 32000

    });
  }
  async _record(item, audioPath) {
    if (this.state.recording) {
      console.warn('Already recording!');
      return;
    }

    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    //if(this.state.stoppedRecording){
      this.prepareRecordingPath(audioPath);
    //}

    this.setState({
      recording: true,
      activeRecorder: item
    });

    try {
      const filePath = await AudioRecorder.startRecording();
      // Should we then rename (move) the file to use a compatible
      // extension for android using react-native-fs
    } catch (error) {
      console.error(error);
    }
  }
  async _stop(item) {
    if (!this.state.recording) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    this.setState((state) => ({
      finishedRecorderIDs: state.finishedRecorderIDs.includes(item.id) ? state.finishedRecorderIDs : state.finishedRecorderIDs.concat([item.id]),
      stoppedRecording: true,
      recording: false,
    }));

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === 'android') {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }
  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'Microphone Permission',
      'message': 'AudioExample needs access to your microphone so you can record audio.'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }
  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });

      if (!hasPermission) return;

      //this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = (data) => {
        this.setState({currentTime: Math.floor(data.currentTime)});
      };

      AudioRecorder.onFinished = (data) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          this._finishRecording(data.status === "OK", data.audioFileURL);
        }
      };
    });
  }
  _finishRecording(didSucceed, filePath) {
    if(didSucceed) {
      this.setState({
        finished: didSucceed,
        cleared: false,
        lastFilePath: filePath
      }, () => {
        setTimeout(()=>{
          this.setState({ cleared: true });
        }, 2000)
      });
    }

    console.log(`Finished recording of duration ${this.state.currentTime} seconds at path: ${filePath} and didSucceedwas ${didSucceed ? 'true' : 'false'}`);
  }
  
  // WARNING I AM TRACKING BY IDS AND SHOULD BE USING
  // AN ES6 SET.
  _startPlaying(item) {
    this.setState((state) => ({
      playingIDs: state.playingIDs.includes(item.id) ? state.playingIDs : state.playingIDs.concat([item.id]),
    }));
  }
  _stopPlaying(item) {
    this.setState((state) => {
      var newPlayingIDs = state.playingIDs.slice(0);
      var index = newPlayingIDs.indexOf(item.id);
      newPlayingIDs.splice(index, 1);
      return {
        playingIDs: index > -1 ? newPlayingIDs : state.playingIDs
      }
    });
  }
/*
   You might think recording and playing are duals, but you'd be wrong.
   The challenge is that a recorder component should only be mounted once
   in your whole app. A player component can be mounted multiple times.
   The problem with the recorder component is not with the component but with
   react-native-audio. It uses a single global recorder even if you use it
   multiple places in your app. So ultimately your react might not have
   shared state, but the ios code behind the scenes sure does! Surprise!
 */
  render() {
    const { navigate } = this.props.navigation;
    const {
      activeRecorder,
      baseAudioPath,
      finishedRecorderIDs,
      playingIDs,
      items,
      recording,
      // finished, // playing
      cleared,
     } = this.state;
    return (
      <View>
        <RedButton title="Go Home" onPress={() => {
          navigate('Home', { user: 'Lucy' })
        }} />
        <ScrollView>
          <View style={{flexDirection:'row', flexWrap:'wrap'}}>
            {items.map((item)=>{
              var audioPath = baseAudioPath + '/' + item.label + '-' + item.id + '.mpeg_4';
              return (
                <RecordGridItem
                label={item.label}
                key={item.id}
                startRecording={this._record.bind(this, item, audioPath)}
                stopRecording={this._stop.bind(this, item)}
                startPlaying={this._startPlaying.bind(this, item)}
                stopPlaying={this._stopPlaying.bind(this, item)}
                hasFinishedRecording={finishedRecorderIDs.includes(item.id)}
                audioPath={audioPath}
                isSelfRecording={recording && (activeRecorder === item)}
                isOtherRecording={recording && (activeRecorder !== item)}
                isSelfPlaying={playingIDs.includes(item.id)}
                isOtherPlaying={playingIDs.length>0 && !playingIDs.includes(item.id)}
              />
              )
            })}
            <Text>{}</Text>
          </View>
        </ScrollView>
        <View style={{
          position:'absolute',
          top: 0,
          left:0,
          height:0,
          minWidth: this.state.deviceWidth,
          backgroundColor: 'red',
        }} onLayout={deviceOrientationDidChange.bind(this, () => {})}>
          <StatusBarAlert
            visible={!cleared}
            message="Recording complete"
            backgroundColor="#3CC29E"
            color="white"
            // onPress={this._showFilePath.bind(this)}
          />
        </View>
      </View>
    )
  }
}
