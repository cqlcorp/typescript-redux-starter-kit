import * as React from 'react';
import { User } from 'state/users';
import './author.component.scss';

export interface AuthorBlurbProps {
    author: User,
    blurb: string
}

export const AuthorBlurb: React.SFC<AuthorBlurbProps> = (props) => {
    return (
        <div className="component-author-blurb">
            <div className="blurb-text">
                { props.blurb }
            </div>
            <div className="blurb-author">
                <div className="author-title">
                    <span className="author-name">{ props.author.name }</span>
                    <a className="author-link" href={ props.author.website } target="_blank">{ props.author.website }</a>
                </div>
                <div className="author-org">
                    <div className="org-title">
                        <span className="org-title-text">{ props.author.company.name }</span>
                    </div>
                    <div className="org-description">
                        <div className="org-header">{ props.author.company.catchPhrase }</div>
                        <div className="org-subheader">{ props.author.company.bs }</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

AuthorBlurb.defaultProps = {
    blurb: ''
}
