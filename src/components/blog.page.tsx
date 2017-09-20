import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from 'state';
import { BlogRoll } from 'models';
import { getBlogPosts, getLoadingState } from 'selectors';
import { routes } from 'constants/routes';
import { LoadingSection } from 'modules/base-components';
import { BlogCard } from 'components/blog.component';
import './blog.page.scss';

export interface BlogPageProps {
    posts: BlogRoll
    isLoading: boolean
}

export const Blog: React.SFC<BlogPageProps> = (props) => {
    return (
        <div id="blog-page">
            <h1>Blog</h1>
            <div className="posts">
                <LoadingSection loading={props.posts.length === 0 && props.isLoading}>
                    {
                        props.posts.map((post, i) => {
                            return (
                                <BlogCard key={i} post={post} />
                            )
                        })
                    }
                </LoadingSection>
            </div>
        </div>
    )
}

Blog.defaultProps = {
    posts: []
}

export const mapStateToProps = (state: RootState): BlogPageProps => {
    return {
        posts: getBlogPosts(state),
        isLoading: getLoadingState(state, routes.BLOG)
    }
}

export const BlogPage = connect(mapStateToProps)(Blog);
