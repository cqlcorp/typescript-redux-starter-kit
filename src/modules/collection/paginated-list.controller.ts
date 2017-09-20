import { ReduxController, ReduxAction, StandardAction, StateDefaults } from 'modules/redux-controller';

export interface List<ListItem> {
    list: ListItem[],
    page: number,
    items: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
}

export interface ListPayload<ListItem> {
    list: ListItem[],
    items: number,
    pages: number,
    page?: number,
    pageSize?: number,
    totalItems?: number
}

@StateDefaults<List<ListItem>>({
    list: [],
    page: 1,
    items: 0,
    pageSize: 20,
    totalItems: 0,
    totalPages: 0
})
export class ListController<ListItem> extends ReduxController<List<ListItem>> {
    @ReduxAction('SET_LIST')
    setList(list: ListItem[], page?: number, ) {
        return this.formatAction({
            list
        })
    }

    @ReduxAction('SET_LIST')
    listReducer(state: List<ListItem>, action: StandardAction<ListPayload<ListItem>>): List<ListItem> {
        return {
            ...state,
            ...action.payload,
            items: action.payload.
        }
    }
}
