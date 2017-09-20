import { ReduxController, StateDefaults, ReduxAction, Reducer } from './controller';
import { StandardAction } from './controller.models';

@StateDefaults([])
export class ListController<Item> extends ReduxController<Item[]> {

    @ReduxAction('RESET')
    public resetState(newDefualts: Item[]): StandardAction<Item[]> {
        newDefualts = newDefualts || this.defaults;
        return this.formatAction(newDefualts);
    }

    @ReduxAction('APPEND')
    public append(items: Item[]) {
        return this.formatAction(items);
    }

    @ReduxAction('PREPEND')
    public prepend(items: Item[]) {
        return this.formatAction(items);
    }

    @Reducer('SET')
    public setReducer(state: Item[], action: StandardAction<Item[]>): Item[] {
        return action.payload
    }

    @Reducer('APPEND')
    public appendReducer(state: Item[], action: StandardAction<Item[]>): Item[] {
        return [
            ...state,
            ...action.payload
        ]
    }

    @Reducer('PREPEND')
    public prependReducer(state: Item[], action: StandardAction<Item[]>): Item[] {
        return [
            ...action.payload,
            ...state
        ]
    }
}
