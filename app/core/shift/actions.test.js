import * as actions from './actions';
import * as types from './actionTypes';

describe('actions', () => {
  describe('fetchExtendedStaffDetails', () => {
    it('should return the correct data', () => {
      const details = actions.fetchExtendedStaffDetails();
      expect(details).toEqual({
        type: types.FETCH_EXTENDED_STAFF_DETAILS,
      });
    });
  });

  describe('fetchExtendedStaffDetailsSuccess', () => {
    it('should return the correct data', () => {
      const details = actions.fetchExtendedStaffDetailsSuccess({ details: true });
      expect(details).toEqual({
        type: types.FETCH_EXTENDED_STAFF_DETAILS_SUCCESS,
        payload: { details: true },
      });
    });
  });

  describe('fetchExtendedStaffDetailsFailure', () => {
    it('should return the correct data', () => {
      const details = actions.fetchExtendedStaffDetailsFailure();
      expect(details).toEqual({
        type: types.FETCH_EXTENDED_STAFF_DETAILS_FAILURE,
      });
    });
  });
});
