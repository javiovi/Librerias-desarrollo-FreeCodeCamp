import React, { Component } from 'react'

class Controls extends Component {
  state = {
    bpm: 1000,
  }

  removeClassInNodes = () => {
    const siblings = document.querySelectorAll('.control-button');
    for (const child of siblings) {
      child.classList.remove('control-button-active');
    }
  }

  record = (e) => {
    this.removeClassInNodes();
    document.getElementById('record').classList.add('control-button-active');
    this.props.record(this.props.name);
  }

  stopRecord = (e) => {
    this.removeClassInNodes();
    document.getElementById('stop').classList.add('control-button-active');
    this.props.stopRecord();
  }

  playRecord = (e) => {
    this.removeClassInNodes();
    document.getElementById('play').classList.add('control-button-active');
    this.props.playRecord(this.props.name, this.state.bpm);
  }

  pause = (e) => {
    this.removeClassInNodes();
    document.getElementById('pause').classList.add('control-button-active');
    this.props.pause(this.props.name);
  }

  deleteRecord = (e) => {
    this.props.deleteRecord(this.props.name);
  }

  setBPM = (e) => {
    this.setState({ bpm: e.target.value });
  }

  render() {
    return (
      <div className='controls'>
        <div id='track-name'>{this.props.name}</div>
        <div id='record' title='Start Recording' className='control-button' onClick={this.record}><i className="fas fa-registered"></i></div>
        <div id='stop' title='Stop Recording' className='control-button' onClick={this.stopRecord}><i className="fas fa-stop-circle"></i></div>
        <div id='play' title='Play Track' className='control-button' onClick={this.playRecord}><i className="fas fa-play-circle"></i></div>
        <div id='pause' title='Pause Track' className='control-button' onClick={this.pause}><i className="fas fa-pause-circle"></i></div>
        <div id='delete' title='Delete Track' className='control-button' onClick={this.deleteRecord}><i className="fas fa-trash-alt"></i></div>
        <div id='seconds' title='Milliseconds between each sound in the track'>
          msBS: <input className='beat-input' type='text' value={this.state.bpm} onChange={this.setBPM} />
          <input className='beat' value={this.state.bpm} type='range' min={100} max={2000} step={1} onChange={this.setBPM} />
        </div>
      </div>
    )
  }
}

export default Controls