import {NAME} from './constants';

export const businessKeyQuery = state => state[NAME].get('businessKeyQuery');

export const caseSearchResults = state => state[NAME].get('caseSearchResults');

export const searching= state => state[NAME].get('searching');

export const loadingCaseDetails= state=> state[NAME].get('loadingCaseDetails');

export const caseDetails = state => state[NAME].get('caseDetails');

export const loadingFormVersion = state => state[NAME].get('loadingFormVersion');

export const formVersionDetails = state => state[NAME].get('formVersionDetails');

export const selectedFormReference = state => state[NAME].get('selectedFormReference');

export const loadingFormSubmissionData = state => state[NAME].get('loadingFormSubmissionData');

export const formSubmissionData = state => state[NAME].get('formSubmissionData');

export const loadingNextSearchResults = state => state[NAME].get('loadingNextSearchResults');

export const processStartSort = state => state[NAME].get('processStartSort');

export const fetchingCaseAttachments = state => state[NAME].get('fetchingCaseAttachments');

export const attachments = state => state[NAME].get('attachments');
