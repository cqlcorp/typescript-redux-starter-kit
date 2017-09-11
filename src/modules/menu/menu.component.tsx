import * as React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { classNames } from 'modules/react-utils';
import './menu.styles.scss';

export interface MenuBtnProps extends LinkProps {
    active?: boolean
}

export interface MenuProps {
    id?: string,
    activeRoute?: string
}

export const MenuBtn: React.SFC<MenuBtnProps> = (props: MenuBtnProps) => {
    const {
        active,
        ...linkProps
    } = props;
    const activeClass = active ? 'active' : '';

    return (
        <Link className={classNames('component-menu-button', activeClass)} {...linkProps} />
    )
}

export const Menu: React.SFC<MenuProps> = (props) => {
    const children = React.Children.map(props.children, (child: React.ReactElement<any>) => {
        if (child.type === MenuBtn) {
            return React.cloneElement(child, {
                active: child.props.to === props.activeRoute
            } as MenuBtnProps)
        } else {
            return child;
        }
    });

    return (
        <div className="component-main-menu">
            <div className="buttons">
                { children }
            </div>
        </div>
    )
}

Menu.defaultProps = {

}
