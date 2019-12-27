import { NAME } from './constants';

export const isFetchingProcessDefinition = state => state[NAME].get('isFetchingProcessDefinition');
export const extendedStaffDetails = state => state[NAME].get('extendedStaffDetails');
export const processDefinition = state => state[NAME].get('processDefinition');
export const form = state => state[NAME].get('form');
export const loadingForm = state => state[NAME].get('loadingForm');
export const submissionStatus = state => state[NAME].get('submissionStatus');
export const submissionResponse = state => state[NAME].get('submissionResponse');
