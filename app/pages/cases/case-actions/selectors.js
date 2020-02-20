import {NAME} from './constants';

export const selectedAction = state => state[NAME].get('selectedAction');

export const loadingActionForm = state => state[NAME].get('loadingActionForm');

export const actionForm = state => state[NAME].get('actionForm');

export const executingAction = state => state[NAME].get('executingAction');

export const actionResponse = state => state[NAME].get('actionResponse');

