import { NAME } from './constants';

export const hasActiveShift = state => state[NAME].get('hasActiveShift');
export const shift = state => state[NAME].get('shift');
export const isFetchingShift = state => state[NAME].get('isFetchingShift');
export const submittingActiveShift = state => state[NAME].get('submittingActiveShift');
export const activeShiftSuccess = state => state[NAME].get('activeShiftSuccess');
export const shiftForm = state => state[NAME].get('shiftForm');
export const loadingShiftForm = state => state[NAME].get('loadingShiftForm');
export const staffDetails = state => state[NAME].get('staffDetails');
export const isFetchingStaffDetails = state => state[NAME].get('isFetchingStaffDetails');
export const extendedStaffDetails = state => state[NAME].get('extendedStaffDetails');
export const isFetchingExtendedStaffDetails = state => state[NAME].get('isFetchingExtendedStaffDetails');
export const endingShift = state => state[NAME].get('endingShift');
export const isCheckingOnBoarding = state => state[NAME].get('isCheckingOnBoarding');
export const failedToCreateShift = state => state[NAME].get('failedToCreateShift');
