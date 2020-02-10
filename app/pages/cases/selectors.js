import {NAME} from './constants';

export const businessKeyQuery = state => state[NAME].get('businessKeyQuery');

export const caseSearchResults = state => state[NAME].get('caseSearchResults');

export const searching= state => state[NAME].get('searching');
