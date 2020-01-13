import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map } = Immutable;

export const shiftInitialState = new Map({
  isFetchingShift: true,
  hasActiveShift: false,
  shift: null,
  submittingActiveShift: false,
  activeShiftSuccess: null,
  loadingShiftForm: true,
  shiftForm: null,
  failedToCreateShift: false,
});

function shiftReducer(state = shiftInitialState, action) {
  switch (action.type) {
    case actions.FETCH_SHIFT_FORM:
      return state;
    case actions.FETCH_SHIFT_FORM_SUCCESS:
      const form = action.payload.entity;
      return state.set('shiftForm', form).set('loadingShiftForm', false);
    case actions.FETCH_SHIFT_FORM_FAILURE:
      return state.set('loadingShiftForm', false);
    case actions.FETCH_ACTIVE_SHIFT:
      return state.set('isFetchingShift', true);
    case actions.FETCH_ACTIVE_SHIFT_SUCCESS:
      const data = action.payload.entity;
      const hasShiftInfo = !!data;
      const shiftInfo = hasShiftInfo ? Immutable.fromJS(data) : null;
      return state.set('isFetchingShift', false)
        .set('hasActiveShift', hasShiftInfo)
        .set('activeShiftSuccess', false)
        .set('shift', shiftInfo);
    case actions.FETCH_ACTIVE_SHIFT_FAILURE:
      return state.set('isFetchingShift', false)
        .set('shift', null)
        .set('activeShiftSuccess', false)
        .set('hasActiveShift', false);
    case actions.SUBMIT_VALIDATION:
      return state.set('submittingActiveShift', true).set('failedToCreateShift', false);
    case actions.CREATE_ACTIVE_SHIFT_SUCCESS:
      const shift = JSON.parse(action.payload.entity.variables['shiftInfo'].value);
      return state
        .set('submittingActiveShift', false)
        .set('activeShiftSuccess', true)
        .set('hasActiveShift', true)
        .set('shift',  Immutable.fromJS(shift));
    case actions.CREATE_ACTIVE_SHIFT_FAILURE:
      return state
        .set('activeShiftSuccess', false).set('submittingActiveShift', false)
        .set('failedToCreateShift', true);
    case actions.END_SHIFT:
      return state.set('endingShift', true);
    case actions.END_SHIFT_SUCCESS:
      return state.set('hasActiveShift', false)
        .set('shift', null)
        .set('endingShift', false);
    case actions.END_SHIFT_FAILURE:
      return state.set('endingShift', false);
    case actions.SET_HAS_ACTIVE_SHIFT:
      return state.set('hasActiveShift', action.hasShift).set('isFetchingShift', false);
    default:
      return state;
  }
}


export default shiftReducer;
