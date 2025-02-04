import type { Reducer } from 'redux';
import { FavoriteQueryStorage } from '@mongodb-js/compass-query-history';
import { PipelineStorage } from '@mongodb-js/compass-aggregations';
import type { ThunkAction } from 'redux-thunk';
import type { RootState } from '.';

export enum ActionTypes {
  DeleteItem = 'compass-saved-aggregations-queries/deleteItem',
  DeleteItemConfirm = 'compass-saved-aggregations-queries/deleteItemConfirm',
}

const favoriteQueryStorage = new FavoriteQueryStorage();
const pipelineStorage = new PipelineStorage();

type DeleteItemAction = {
  type: ActionTypes.DeleteItem;
  id: string;
};

type DeleteItemConfirmAction = {
  type: ActionTypes.DeleteItemConfirm;
  id: string;
};

export type Actions = DeleteItemAction | DeleteItemConfirmAction;

export type State = {
  id: string | null;
};

const INITIAL_STATE: State = {
  id: null,
};

const reducer: Reducer<State, Actions> = (state = INITIAL_STATE, action) => {
  if (action.type === ActionTypes.DeleteItem) {
    return {
      id: action.id,
    };
  }
  if (action.type === ActionTypes.DeleteItemConfirm) {
    return {
      id: null,
    };
  }
  return state;
};

export const deleteItem = (id: string): DeleteItemAction => {
  return { type: ActionTypes.DeleteItem, id };
};

export const deleteItemConfirm = (): ThunkAction<
  void,
  RootState,
  void,
  Actions
> => {
  return async (dispatch, getState) => {
    const {
      savedItems: { items },
      deleteItem: { id },
    } = getState();
    const item = items.find((x) => x.id === id);
    if (!item) {
      return;
    }
    const deleteAction =
      item.type === 'query'
        ? favoriteQueryStorage.delete.bind(favoriteQueryStorage)
        : pipelineStorage.delete.bind(pipelineStorage);
    await deleteAction(item.id);
    dispatch({ type: ActionTypes.DeleteItemConfirm, id: item.id });
  };
};

export default reducer;
