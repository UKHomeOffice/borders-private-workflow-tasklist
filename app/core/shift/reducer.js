import Immutable from 'immutable';
import staffReducer, { staffInitialState } from './staff.reducer';
import shiftReducer, { shiftInitialState } from './shift.reducer';
import onboardingCheckReducer, { onboardingCheckState } from './onboardChecker.reducer';

const reducers = [onboardingCheckReducer, staffReducer, shiftReducer];
const initial = Immutable.Map({});

const initialState = initial.mergeWith(
  onboardingCheckState,
  shiftInitialState,
  staffInitialState,
);

function reducer(state = initialState, action) {
  return reducers.reduce((s, r) => r(s, action), state);
}

export default reducer;
