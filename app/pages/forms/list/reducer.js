import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map, List } = Immutable;

const initialState = new Map({
  isFetchingProcessDefinitions: true,
  processDefinitions: List([]),
});

function reducer(state = initialState, action) {
  let data;
  switch (action.type) {
    case actions.FETCH_PROCESS_DEFINITIONS:
      return state.set('isFetchingProcessDefinitions', true);
    case actions.FETCH_PROCESS_DEFINITIONS_SUCCESS:
      data = action.payload.entity._embedded
        ? action.payload.entity._embedded['process-definitions']
        : [];
      return state
        .set('isFetchingProcessDefinitions', false)
        .set('processDefinitions', Immutable.fromJS(data));
    case actions.FETCH_PROCESS_DEFINITIONS_FAILURE:
      return state.set('isFetchingProcessDefinitions', false);
    default:
      return state;
  }
}

export default reducer;
