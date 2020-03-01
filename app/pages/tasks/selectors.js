import {NAME} from './constants';

export const yourTasks = state => state[NAME].get('yourTasks');

export const yourGroupTasks = state => state[NAME].get('yourGroupTasks');

