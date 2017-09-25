import * as React from 'react';
import { shallow } from 'enzyme';
import { Loader, LoadingSection } from './loader.component';

describe('Tests for the <Loader /> component.', () => {
    const loader = shallow(<Loader />)
    it('should render a bunch of dots', () => {
        expect(loader.find('.dot').length).toBe(11);
    })
});

describe('Tests for the <LoadingSection /> conditional loading component.', () => {
    const test = <h1>Hello World</h1>;
    const basicLoader = <Loader />;
    const loadingSection = shallow(<LoadingSection loading={true}>{test}</LoadingSection>)
    const notLoadingSection = shallow(<LoadingSection loading={false}>{test}</LoadingSection>)
    const defaultLoadingSection = shallow(<LoadingSection loading={undefined}>{test}</LoadingSection>)

    it('should load a loader when loading is true', () => {
        expect(loadingSection.contains(basicLoader)).toBeTruthy();
        expect(loadingSection.contains(test)).toBeFalsy();
    })

    it('should load children when loading is false', () => {
        expect(notLoadingSection.contains(test)).toBeTruthy();
        expect(notLoadingSection.contains(basicLoader)).toBeFalsy();
    })

    it('should load children when loading is undefined', () => {
        expect(defaultLoadingSection.contains(basicLoader)).toBeFalsy();
        expect(defaultLoadingSection.contains(test)).toBeTruthy();
    })
})
