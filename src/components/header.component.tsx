import * as React from 'react';
import { Images } from 'assets';

export const Header: React.SFC<any> = (props) => {
    return (
        <div className="App-header">
            <img src={Images.logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
        </div>
    )
}

Header.defaultProps = {

}
