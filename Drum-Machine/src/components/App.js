import React, { Component } from 'react';
import _ from 'lodash';

import DrumPad from './DrumPad';
import ToggleTheme from './ThemeToggle';
import Controls from './Controls';

const samples = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    color: 'pink',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  }, {
    keyCode: 87,
    keyTrigger: 'W',
    color: 'pink',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  }, {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Heater-3',
    color: 'pink',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  }, {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Heater-4',
    color: 'pink',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  }, {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Clap',
    color: 'teal',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  }, {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Open-HH',
    color: 'indigo',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  }, {
    keyCode: 90,
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    color: 'amber',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  }, {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Kick',
    color: 'amber',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  }, {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Closed-HH',
    color: 'indigo',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  },
];

class App extends Component {
  state = {
    display: String.fromCharCode(160),
    volume: .5,
    trackName: '',
    trackToRecord: '',
    isRec: false,
    tracks: {},
    intervals: {},
  }

  updateDisplay = (display) => {
    const { trackToRecord, isRec } = this.state;
    const tracks = { ...this.state.tracks };
    if (isRec) tracks[trackToRecord].audio = [...tracks[trackToRecord].audio, display];
    this.setState({ display, tracks });
  }

  setVolume = (e) => {
    const volume = e.target.value;
    this.setState(
      { volume, display: `Volume: ${Math.round(volume * 100)}` },
      _ => setTimeout(_ => this.setState({ display: String.fromCharCode(160), }), 1000)
    )
  }

  record = (trackName) => {
    if (this.state.isRec) { alert('already recording!'); return; }
    this.setState({ isRec: true, trackToRecord: trackName });
  }

  stopRecord = () => {
    this.setState({ isRec: false });
  }



  playRecord = async (trackName, bpm) => {
    const tracks = { ...this.state.tracks };
    const trackToPlay = tracks[trackName];
    if (!trackToPlay.audio.length) return;
    let i = 0;
    const sleep = m => new Promise(r => setTimeout(r, m));
    for (let index = 0; index < trackToPlay.audio.length; index++) {
      document.getElementById(trackToPlay.audio[index]).click();
      if (index + 1 < trackToPlay.audio.length) await sleep(bpm);
    }

    const interval = setInterval(_ => {
      if (i === trackToPlay.audio.length) i = 0;
      document.getElementById(trackToPlay.audio[i]).click();
      i += 1;
    }, bpm);
    this.setState({ intervals: { ...this.state.intervals, [trackName]: { interval } } });
  }

  pause = (trackName) => {
    const intervals = { ...this.state.intervals };
    if (!intervals[trackName]) return;
    clearInterval(intervals[trackName].interval);
    this.setState({ intervals });
  }

  deleteRecord = (trackName) => {
    const tracks = { ...this.state.tracks };
    const filtered = _.omit(tracks, trackName);
    this.setState({ tracks: filtered });
  }

  updateTrackName = (e) => {
    this.setState({ trackName: e.target.value });
  }

  addNewTrack = (e) => {
    e.preventDefault();
    const tracks = { ...this.state.tracks };
    if (_.find(tracks, this.state.trackName)) { alert('Name already taken!'); return; }
    if (this.state.trackName.length > 8) { alert('Name too long! Max 8 char'); return; }
    this.setState({ trackName: '', tracks: { ...this.state.tracks, [this.state.trackName]: { name: this.state.trackName, audio: [] } } });
  }

  render() {
    const pads = samples.map(pad => <DrumPad volume={this.state.volume} updateDisplay={this.updateDisplay} key={pad.keyCode} {...pad} />);
    const trackControl = _.map(this.state.tracks, track => (
      <Controls key={track.name} {...track} record={this.record} stopRecord={this.stopRecord} playRecord={this.playRecord} pause={this.pause} deleteRecord={this.deleteRecord} />
    ));
    return (
      <div className='container'>
        <Header />
        <ToggleTheme />
        <div id='drum-machine' className='grid'>
          <div className='track-list'>
            {trackControl}
            <form className='track-name-form' onSubmit={this.addNewTrack}>
              <input value={this.state.trackName} onChange={this.updateTrackName} type='text' placeholder='Create new track' />
            </form>
          </div>
          <div id='display' className='display'>
            {this.state.display}
          </div>
          <div className='volume'>
            <input type='range' name='volume' id='volume' min='0' max='1' step='0.01' value={this.state.volume} onChange={this.setVolume} />
          </div>
          <div id='pads' className='pads-grid'>
            {pads}
          </div>
        </div>
      </div>
    )
  }
}

const Header = () => (
  <header>
    <h1>Drum Machine</h1>
  </header>
)

export default App