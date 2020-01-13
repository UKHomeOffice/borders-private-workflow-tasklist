import Immutable from 'immutable';
import * as actions from './actions';
import reducer, { shiftInitialState } from './shift.reducer';


describe('shift reducer', () => {
  const initialState = shiftInitialState;
  it('handles fetchShiftForm', () => {
    const state = reducer(initialState, actions.fetchShiftForm());
    expect(state.get('loadingShiftForm'))
      .toEqual(true);
  });
  it('handles fetchShiftFormSuccess', () => {
    const formObject = {
      name: 'testForm',
      components: [
        {
          key: 'key',
        },
      ],
    };
    const state = reducer(initialState, actions.fetchShiftFormSuccess({
      entity: formObject,
    }));
    expect(state.get('loadingShiftForm')).toEqual(false);
    expect(state.get('shiftForm')).toEqual(formObject);
  });
  it('handles fetchActiveShiftSuccess', () => {
    const shiftDetails = {
      staffid: 'staffid',
    };
    const state = reducer(initialState, actions.fetchActiveShiftSuccess({
      entity: shiftDetails,
    }));
    expect(state.get('isFetchingShift')).toEqual(false);
    expect(state.get('hasActiveShift')).toEqual(true);
    expect(state.get('shift')).toEqual(Immutable.fromJS(shiftDetails));
  });
});
