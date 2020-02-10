import {NAME} from './constants';

export const businessKeyQuery = state => state[NAME].get('businessKeyQuery');

export const caseSearchResults = state => state[NAME].get('caseSearchResults');

export const searching= state => state[NAME].get('searching');

export const loadingCaseDetails= state=> state[NAME].get('loadingCaseDetails');

export const caseDetails = state => state[NAME].get('caseDetails');

export const loadingFormVersion = state => state[NAME].get('loadingFormVersion');

export const formVersionDetails = state => state[NAME].get('formVersionDetails');

export const selectedVersionId = state => state[NAME].get('selectedVersionId');
