import React, { Component } from 'react'

export class ThemeToggle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLight: true,
    }
  }

  toggleTheme = () => {
    const body = document.querySelector('body');
    if (this.state.isLight) {
      body.classList.remove('t--light');
      body.classList.add('t--dark');
    } else {
      body.classList.remove('t--dark');
      body.classList.add('t--light');
    }
    this.setState((prevState) => ({ isLight: !prevState.isLight }));
  }

  render() {
    return (
      <div className='toggle-theme-container'>
        <button className='toggle-theme-button' onClick={this.toggleTheme} >
          {this.state.isLight ? 'Lights off' : 'Lights on'}
        </button>
      </div>
    )
  }
}

export default ThemeToggle