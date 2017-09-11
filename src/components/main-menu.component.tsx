import * as React from 'react';
import { connect } from 'react-redux';
import { Menu, MenuBtn } from 'modules/menu';
import { routes } from 'constants/routes';
import { RootState } from 'state';

export interface MainMenuStateProps {
    currentRoute: string
}

export interface MainMenuDispatchProps {

}

export type MainMenuProps = MainMenuDispatchProps & MainMenuStateProps;

const MainMenuComponent: React.SFC<MainMenuProps> = (props) => {
    return (
        <Menu id="main-menu" activeRoute={props.currentRoute}>
            <MenuBtn to={routes.HOME} >Home</MenuBtn>
            <MenuBtn to={routes.COUNTER_DEMO} >Counter Demo</MenuBtn>
        </Menu>
    )
}

const mapStateToProps = (state: RootState): MainMenuStateProps => ({
    currentRoute: state.currentRoute.currentRoute
});
const mapDispatchToProps = (): MainMenuDispatchProps => ({

});

export const MainMenu = connect(mapStateToProps, mapDispatchToProps)(MainMenuComponent);
