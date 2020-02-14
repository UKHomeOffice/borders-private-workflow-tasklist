import * as types from './actionTypes';

const fetchShiftForm = () => ({
  type: types.FETCH_SHIFT_FORM,
});

const fetchShiftFormSuccess = payload => ({
  type: types.FETCH_SHIFT_FORM_SUCCESS,
  payload,
});

const fetchShiftFormFailure = () => ({
  type: types.FETCH_SHIFT_FORM_FAILURE,
});

const fetchActiveShift = () => ({
  type: types.FETCH_ACTIVE_SHIFT,
});

const fetchActiveShiftSuccess = payload => ({
  type: types.FETCH_ACTIVE_SHIFT_SUCCESS,
  payload,
});

const fetchActiveShiftFailure = () => ({
  type: types.FETCH_ACTIVE_SHIFT_FAILURE,
});

const createActiveShift = shiftInfo => ({
  type: types.CREATE_ACTIVE_SHIFT,
  shiftInfo,
});

const createActiveShiftSuccess = (payload) => ({
  type: types.CREATE_ACTIVE_SHIFT_SUCCESS,
  payload
});

const createActiveShiftFailure = () => ({
  type: types.CREATE_ACTIVE_SHIFT_FAILURE,
});

const submit = (formId, submissionData) => ({
  type: types.SUBMIT_VALIDATION,
  formId,
  submissionData,
});

const submitSuccess = payload => ({
  type: types.SUBMIT_VALIDATION_SUCCESS,
  payload,
});

const submitFailure = () => ({
  type: types.SUBMIT_VALIDATION_FAILURE,
});

const fetchStaffDetails = () => ({
  type: types.FETCH_STAFF_DETAILS,
});

const fetchStaffDetailsSuccess = payload => ({
  type: types.FETCH_STAFF_DETAILS_SUCCESS,
  payload,
});

const fetchStaffDetailsFailure = () => ({
  type: types.FETCH_STAFF_DETAILS_FAILURE,
});

const fetchExtendedStaffDetails = (payload) => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS,
});

const fetchExtendedStaffDetailsSuccess = payload => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS_SUCCESS,
  payload,
});

const fetchExtendedStaffDetailsFailure = () => ({
  type: types.FETCH_EXTENDED_STAFF_DETAILS_FAILURE,
});

const endShift = () => ({
  type: types.END_SHIFT,
});

const endShiftSuccess = payload => ({
  type: types.END_SHIFT_SUCCESS,
  payload,
});

const endShiftFailure = () => ({
  type: types.END_SHIFT_FAILURE,
});

const setHasActiveShift = (hasShift) => ({
  type: types.SET_HAS_ACTIVE_SHIFT,
  hasShift
});

const performOnboardingCheck = () => ({
  type: types.PERFORM_ONBOARDING_CHECK,
});

const onboardingCheckCompete = () => ({
  type: types.PERFORM_ONBOARDING_CHECK_COMPLETE,
});

export {
  submit,
  submitSuccess,
  submitFailure,
  fetchActiveShift,
  fetchActiveShiftSuccess,
  fetchActiveShiftFailure,
  createActiveShift,
  createActiveShiftSuccess,
  createActiveShiftFailure,
  fetchShiftForm,
  fetchShiftFormSuccess,
  fetchShiftFormFailure,
  fetchStaffDetails,
  fetchStaffDetailsSuccess,
  fetchStaffDetailsFailure,
  fetchExtendedStaffDetails,
  fetchExtendedStaffDetailsSuccess,
  fetchExtendedStaffDetailsFailure,
  endShift,
  endShiftFailure,
  endShiftSuccess,
  setHasActiveShift,
  performOnboardingCheck,
  onboardingCheckCompete,
};
