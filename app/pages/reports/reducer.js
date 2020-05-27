import Immutable from 'immutable';
import * as actions from './actionTypes';

const { List, Map } = Immutable;

export const initialState = new Map({
  reports: new List(),
  loadingReports: false,
});

function reducer(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_REPORTS_LIST:
      return state.set('loadingReports', true);
    case actions.FETCH_REPORTS_LIST_SUCCESS: {
      const data = action.payload.entity;
      return state
        .set('loadingReports', false)
        .set('reports', Immutable.fromJS(data));
    }
    case actions.FETCH_REPORTS_LIST_FAILURE:
      return state.set('loadingReports', false);
    default:
      return state;
  }
}

export default reducer;
