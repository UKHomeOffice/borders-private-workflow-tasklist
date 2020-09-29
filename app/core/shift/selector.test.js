import Immutable from 'immutable';
import * as selectors from './selectors';

const { Map } = Immutable;

describe('shift selector', () => {
  const initialState = new Map({
    isFetchingShift: true,
    hasActiveShift: true,
    shift: Immutable.fromJS({
      staffid: 'staffid',
    }),
    submittingActiveShift: true,
    activeShiftSuccess: true,
    loadingShiftForm: true,
    shiftForm: {
      name: 'shiftForm',
      components: [],
    },
    endingShift: false,
  });
  const state = {
    'shift-page': initialState,
  };
  it('should return hasActiveShift', () => {
    const result = selectors.hasActiveShift(state);
    expect(result).toEqual(true);
  });
  it('should return isFetchingShift', () => {
    const result = selectors.isFetchingShift(state);
    expect(result).toEqual(true);
  });
  it('should return submittingActiveShift', () => {
    const result = selectors.submittingActiveShift(state);
    expect(result).toEqual(true);
  });
  it('should return activeShiftSuccess', () => {
    const result = selectors.activeShiftSuccess(state);
    expect(result).toEqual(true);
  });
  it('should return loadingShiftForm', () => {
    const result = selectors.loadingShiftForm(state);
    expect(result).toEqual(true);
  });
  it('should return endingShift', () => {
    const result = selectors.endingShift(state);
    expect(result).toEqual(false);
  });
});
