import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'state';
import { BlogRoll } from 'models';
import { getBlogPosts } from 'selectors';
import { BlogCard } from 'components/blog.component';
import './blog.page.scss';

export interface BlogPageProps {
    posts: BlogRoll
}

export const Blog: React.SFC<BlogPageProps> = (props) => {
    return (
        <div id="blog-page">
            <h1>Blog</h1>
            <div className="posts">
                {
                    props.posts.map((post, i) => {
                        return (
                            <BlogCard key={i} post={post} />
                        )
                    })
                }
            </div>
        </div>
    )
}

Blog.defaultProps = {
    posts: []
}

export const mapStateToProps = (state: RootState): BlogPageProps => {
    return {
        posts: getBlogPosts(state)
    }
}

export const BlogPage = connect(mapStateToProps)(Blog);
