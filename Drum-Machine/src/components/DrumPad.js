import React, { Component } from 'react';

class DrumPad extends Component {
  state = {
    clicked: '',
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    if (e.keyCode === this.props.keyCode && e.target.nodeName !== 'INPUT') this.playPad();
  }

  playPad = (e) => {
    const padAudio = document.getElementById(this.props.keyTrigger);
    padAudio.currentTime = 0;
    padAudio.volume = this.props.volume;
    padAudio.play();
    this.setState({ clicked: 'drum-pad-clicked ' + this.props.color }, _ => setTimeout(_ => this.setState({ clicked: '' }), 200));
    this.props.updateDisplay(this.props.id);
  }

  render() {
    return (
      <div className={'drum-pad ' + this.state.clicked} id={this.props.id} onClick={this.playPad}>
        {this.props.keyTrigger}
        <audio className='clip' src={this.props.url} id={this.props.keyTrigger}>
        </audio>
      </div>
    )
  }
}

export default DrumPad;