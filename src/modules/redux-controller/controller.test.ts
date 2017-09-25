import { delay } from 'redux-saga';
import { ReduxController, Saga, ReduxAction, StateDefaults } from './controller';

describe('Tests for ReduxController decorators', () => {
    const testType = <T>(defaults: T) => {
        @StateDefaults(defaults)
        class TestController extends ReduxController<any[]>{}
        const TestActions = new TestController('TEST');
        const reducer = TestActions.createReducer();
        const defaultState = reducer(undefined, {
            type: 'INIT',
            payload: undefined
        });
        expect(TestActions.defaults).toEqual(defaults);
        expect(defaultState).toEqual(defaults);
    }

    it('should honor state default overrides with arrays', () => {
        testType<any[]>([]);
        testType<any[]>([1, 2, 3]);
        testType<any[]>([{item: 1}, {item: 2}, {item: 3}]);
    })

    it('should honor state default overrides with objects', () => {
        interface TestObject {
            number: number,
            message: string
        }

        testType<TestObject>({
            number: 42,
            message: 'The answer to the universe'
        })
    })

    it('should honor state default overrides with primatives', () => {
        testType(1);
        testType('Hello World');
        testType(true);
        testType(false);
    })

    it('should honor state default overrides with dates', () => {
        testType(new Date());
    })

    it('should honor state default overrides with functions', () => {
        testType(function() {});
    })
})

describe('Tests for ReduxController actions', () => {
    it('should create namespaced actions', () => {
        const TestActions = new ReduxController<Object>('TEST');
        expect(TestActions.namespace).toBe('TEST');
        const action = TestActions.setState({
            test: 'Hello World'
        });
        expect(action).toHaveProperty('type', 'TEST/SET');
        expect(typeof action.payload).toBe('object');
        expect(action.payload.test).toBe('Hello World');
    })
})

describe('Tests for ReduxController reducers', () => {
    const BaseActions = new ReduxController('BASE');
    const baseReducer = BaseActions.createReducer();
    const baseDefaultState = baseReducer(undefined, { type: 'INIT', payload: undefined });

    it('should export a valid reducer', () => {
        expect(typeof baseReducer).toBe('function');
    })

    it('should default state to an object by default', () => {
        expect(BaseActions.defaults).toEqual({});
        expect(baseDefaultState).toEqual({});
    })

    it('should honor a relevant action', () => {
        const state = {
            test: 'Hello World',
            number: 123
        }
        const newState = baseReducer(state, BaseActions.setState({
            number: 321
        }));
        expect(newState).toEqual({
            test: 'Hello World',
            number: 321
        })
    })

    it('should ignore a non-relevant action', () => {
        const state = {
            test: 'Hello World',
            number: 123
        }
        const newState = baseReducer(state, {
            type: 'WLEKJRLEWKRJW',
            payload: {
                test: 'Foo Bar'
            }
        });
        expect(state).toEqual(newState);
    })
})

describe('Tests for ReduxController Sagas', () => {
    const testSagaDidRun = jest.fn();
    const testSagaDidFinish = jest.fn();

    class SagaTest extends ReduxController<Object> {
        @ReduxAction('TEST_DELAY')
        test() {
            return this.formatAction()
        }

        @Saga('TEST_DELAY')
        *testSaga() {
            testSagaDidRun();
            yield delay(0);
            testSagaDidFinish();
        }
    }

    const TestActions = new SagaTest('TEST');
    const rootSaga = TestActions.createSaga();

    it('should export a valid saga', () => {
        expect(typeof rootSaga).toBe('function');
    });

    it('should not immediately call the saga', () => {
        rootSaga();
        expect(testSagaDidRun).toHaveBeenCalledTimes(0);
    });

    it('should yield class sagas with the proper effects', () => {
        const gen = rootSaga();
        const args = gen.next().value.ALL[0].CALL.fn().next().value.FORK.args;
        const actionType = args[0];
        const next = args[1]().next().value.next;
        expect(actionType).toBe('TEST/TEST_DELAY');
        expect(testSagaDidRun).toHaveBeenCalledTimes(0);
        expect(testSagaDidFinish).toHaveBeenCalledTimes(0);
        next();
        expect(testSagaDidRun).toHaveBeenCalledTimes(1);
        expect(testSagaDidFinish).toHaveBeenCalledTimes(0);
        next();
        expect(testSagaDidRun).toHaveBeenCalledTimes(1);
        expect(testSagaDidFinish).toHaveBeenCalledTimes(1);
    })
})
