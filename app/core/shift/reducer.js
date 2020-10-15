import Immutable from 'immutable';
import shiftReducer, { shiftInitialState } from './shift.reducer';
import onboardingCheckReducer, { onboardingCheckState } from './onboardChecker.reducer';

const reducers = [onboardingCheckReducer, shiftReducer];
const initial = Immutable.Map({});

const initialState = initial.mergeWith(onboardingCheckState, shiftInitialState);

function reducer(state = initialState, action) {
  return reducers.reduce((s, r) => r(s, action), state);
}

export default reducer;
