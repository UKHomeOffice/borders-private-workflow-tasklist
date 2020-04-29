import {NAME} from './constants';

export const isFetchingTasksSelector = state => state[NAME].get('isFetchingTasks');
export const tasksSelector = state => state[NAME].get('tasks');
export const totalSelector = state => state[NAME].get('total');
export const sortValueSelector = state => state[NAME].get('sortValue');
export const filterValueSelector = state => state[NAME].get('filterValue');
export const groupBySelector = state => state[NAME].get('groupBy');
export const nextPageUrlSelector = state => state[NAME].get('nextPageUrl');
export const prevPageUrlSelector = state => state[NAME].get('prevPageUrl');
export const firstPageUrlSelector = state => state[NAME].get('firstPageUrl');
export const lastPageUrlSelector = state => state[NAME].get('lastPageUrl');
