import * as React from 'react';
import { Provider } from 'react-redux'
import { Router, Route, Switch } from 'react-router-dom';

import './App.scss';
import { store } from 'state';
import { Header, MainMenu, IntroPage, CounterDemoPage, BlogPage } from 'components';
import { routes } from 'constants/routes';
import { history } from 'modules/route-utils';

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <div className="App">
                        <Header />
                        <MainMenu />
                        <Switch>
                            <Route path={routes.HOME} exact={true} component={IntroPage} />
                            <Route path={routes.COUNTER_DEMO} exact={true} component={CounterDemoPage} />
                            <Route path={routes.BLOG} exact={true} component={BlogPage} />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
