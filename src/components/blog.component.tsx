import * as React from 'react';
import { Html } from 'modules/base-components'
import { AuthorBlurb } from 'components/author.component';
import { BlogPost } from 'models';
import './blog.component.scss';

export interface BlogPostProps {
    post: BlogPost
}

export const BlogCard: React.SFC<BlogPostProps> = (props) => {
    return (
        <div className="component-blog-post">
            <h2 className="blog-title">{props.post.title}</h2>
            <div className="blog-content">
                <Html content={props.post.body} />
            </div>
            <div className="blog-author">
                {
                    props.post.author ? <AuthorBlurb author={props.post.author} blurb="by" /> : null
                }
            </div>
        </div>
    )
}
