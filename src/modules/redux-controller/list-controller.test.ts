import { ListController } from './list-controller';

describe('Tests for ListController', () => {
    it('should initialize with default state of type array', () => {
        const TestListActions = new ListController('TEST');
        expect(Array.isArray(TestListActions.defaults)).toBe(true)
    })

    it('should allow initialization with a custom array', () => {
        const initialState = [
            1, 2, 3, 4, 5
        ]
        const TestListActions = new ListController('TEST', initialState);
        expect(TestListActions.defaults).toBe(initialState);

        const reducer = TestListActions.createReducer();
        const defaults = reducer(undefined, { type: 'INIT', payload: undefined });
        expect(defaults).toBe(initialState);
    })
})
