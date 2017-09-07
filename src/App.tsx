import * as React from 'react';
import { Provider } from 'react-redux'
import './App.scss';

import { store, PushupActions, SitupActions } from './state';

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
                            <button onClick={() => store.dispatch(PushupActions.countOnInterval(1000, 1))}>Auto Count</button>
                            <button onClick={() => store.dispatch(PushupActions.stopInterval())}>Stop Counting</button>
                        </div>
                        <div className="situps col section">
                            <h3>Situps</h3>
                            <SitupCounter />
                            <button onClick={() => store.dispatch(SitupActions.countOnInterval(1000, 1))}>Auto Count</button>
                            <button onClick={() => store.dispatch(SitupActions.stopInterval())}>Stop Counting</button>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }
}

export default App;
