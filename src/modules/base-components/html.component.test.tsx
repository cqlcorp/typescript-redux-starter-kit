import * as React from 'react';
import { mount } from 'enzyme';
import { Html } from './html.component';

const testHtml = '<h1>Hello World</h1>';

const html = mount(<Html content={testHtml} />);
const noHtml = mount(<Html content="" />);

describe('tests the <Html /> component to make sure it renders HTML properly', () => {
    it('should render some HTML', () => {
        expect(html.html()).toContain(testHtml);
    });

    it('should allow a blank string', () => {
        expect(noHtml.hasClass('component-html'))
        expect(noHtml.children().length).toBe(0);
    })
})
