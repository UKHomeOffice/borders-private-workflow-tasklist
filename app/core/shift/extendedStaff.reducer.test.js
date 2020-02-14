import Immutable from 'immutable';
import * as actions from './actions';
import reducer, { extendedStaffInitialState } from './extendedStaff.reducer';

describe('extendedStaffReducer', () => {
  const initialState = extendedStaffInitialState;

  it('handles fetchExtendedStaffDetails', () => {
    const state = reducer(initialState, actions.fetchExtendedStaffDetails());
    expect(state.get('isFetchingExtendedStaffDetails')).toEqual(true);
  });

  it('handles fetchExtendedStaffDetailsSuccess when given a payload', () => {
    const payload = [{ email: 'officer@homeoffice.gov.uk' }];
    const state = reducer(initialState, actions.fetchExtendedStaffDetailsSuccess({
      entity: payload
    }));
    expect(state.get('isFetchingExtendedStaffDetails')).toEqual(false);
    expect(state.get('extendedStaffDetails')).toEqual(Immutable.fromJS(payload[0]));
  });

  it('handles fetchExtendedStaffDetailsSuccess when not given a payload', () => {
    const state = reducer(initialState, actions.fetchExtendedStaffDetailsSuccess({}));
    expect(state.get('isFetchingExtendedStaffDetails')).toEqual(false);
    expect(state.get('extendedStaffDetails')).toEqual(null);
  });

  it('handles fetchExtendedStaffDetailsFailure', () => {
    const state = reducer(initialState, actions.fetchExtendedStaffDetailsFailure());
    expect(state.get('isFetchingExtendedStaffDetails')).toEqual(false);
  });
});
