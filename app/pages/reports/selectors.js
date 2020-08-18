import NAME from './constants';

export const appConfig = state => state.appConfig;
export const reports = state => state[NAME].get('reports');
export const loadingReports = state => state[NAME].get('loadingReports');
