import * as React from 'react';

export interface HtmlProps {
    content: string
}

export const Html: React.SFC<HtmlProps> = (props) => {
    const createMarkup = () => ({
        __html: props.content
    });

    return (
        <div className="component-html" dangerouslySetInnerHTML={createMarkup()}></div>
    )
}

Html.defaultProps = {
    content: ''
}
