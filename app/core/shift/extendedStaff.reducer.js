import Immutable from 'immutable';
import * as actions from './actionTypes';
import secureLocalStorage from '../../common/security/SecureLocalStorage';

const { Map } = Immutable;

export const extendedStaffInitialState = new Map({
  extendedStaffDetails: null,
  isFetchingExtendedStaffDetails: true,
});

function extendedStaffReducer(state = extendedStaffInitialState, action) {
  let extendedStaff;
  let extendedStaffResponse;
  let hasExtendedStaffDetails;
  switch (action.type) {
    case actions.FETCH_EXTENDED_STAFF_DETAILS:
      return state.set('isFetchingExtendedStaffDetails', true);
    case actions.FETCH_EXTENDED_STAFF_DETAILS_SUCCESS:
      extendedStaffResponse = action.payload.entity;
      hasExtendedStaffDetails =
        extendedStaffResponse && extendedStaffResponse.length !== 0;
      extendedStaff = hasExtendedStaffDetails
        ? Immutable.fromJS(extendedStaffResponse[0])
        : null;
      if (extendedStaff) {
        secureLocalStorage.set('extendedStaffDetails', extendedStaff.toJS());
      }
      return state
        .set('isFetchingExtendedStaffDetails', false)
        .set('extendedStaffDetails', extendedStaff);
    case actions.FETCH_EXTENDED_STAFF_DETAILS_FAILURE:
      return state.set('isFetchingExtendedStaffDetails', false);
    default:
      return state;
  }
}

export default extendedStaffReducer;
