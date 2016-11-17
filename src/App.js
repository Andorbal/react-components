import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Tappable from './components/Tappable';

class App extends Component {
  constructor() {
    super();
    
    this.state = {toggled: true};
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div>
          <Tappable>Click me</Tappable>
          <Tappable onTap={() => {
            console.log('Tap 1');
            this.setState({toggled: !this.state.toggled});
          }} className='foo'>And me!</Tappable>
          {
            this.state.toggled &&
            <Tappable onTap={() => console.log('Tap 2')} className='foo'>Hello</Tappable>
          }
        </div>

        <div>
        </div>
      </div>
    );
  }
}

export default App;
