import Immutable, { List } from 'immutable';
import * as actions from './actionTypes';

const { Map } = Immutable;

export const initialState = new Map({
  hasError: false,
  errors: new List([]),
  unauthorised: false,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.HANDLE_UNAUTHORISED:
      return state.set('unauthorised', true);
    case actions.HANDLE_ERROR:
      const error = action.payload;
      const errorToReturn = {};
      errorToReturn.status = error.status.code;

      errorToReturn.url = error.request ? `${error.request.method} -> ${error.request.path}` : '';
      if (error.entity) {
        errorToReturn.payload = error.entity.payload;
        errorToReturn.error = error.entity.error;
        if (error.entity.message) {
          errorToReturn.message = error.entity.message;
        } else {
          errorToReturn.message = error.entity ? error.entity : error.message;
        }
      }
      if (!errorToReturn.message) {
        errorToReturn.message = `Failed to execute action: ${JSON.parse(error.error.value)}`;
      }
      errorToReturn.raw = error;


      const errors = state.get('errors')
        .push(Immutable.fromJS(errorToReturn));
      const updated = errors.groupBy(x => x.get('message')).map(x => x.first()).toList();

      return state.set('hasError', true)
        .set('errors', updated);

    case actions.RESET_ERROR:
      return state.set('hasError', false)
        .set('unauthorised', false)
        .set('errors', new List([]));

    default:
      return state;
  }
}


export default reducer;
