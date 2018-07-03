import {NAME} from "./constants";

export const form = state => state[NAME].get('form');
export const loadingTaskForm = state => state[NAME].get('loadingTaskForm');
export const taskFormValidationSuccessful = state => state[NAME].get('taskFormValidationSuccessful');
export const submittingTaskFormForCompletion = state => state[NAME].get('submittingTaskFormForCompletion');
export const taskFormCompleteSuccessful = state => state[NAME].get('taskFormCompleteSuccessful');