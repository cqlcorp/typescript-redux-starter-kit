import * as React from 'react';
import { Provider } from 'react-redux'
import './App.scss';

import { store } from './state';

import { PushupCounter, SitupCounter } from './components';

const logo = require('./logo.svg');

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <h2>Welcome to React</h2>
                    </div>
                    <p className="App-intro">
                        To get started, edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <div className="counters row">
                        <div className="pushups col section">
                            <h3>Pushups</h3>
                            <PushupCounter />
                        </div>
                        <div className="situps col section">
                            <h3>Situps</h3>
                            <SitupCounter />
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }
}

export default App;
