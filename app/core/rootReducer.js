import { combineReducers } from 'redux';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { routerReducer } from 'react-router-redux';
import { combineEpics } from 'redux-observable';
import keycloakReducer from '../common/security/keycloakReducer';
import notificationPage from '../pages/messages';
import shift from './shift/index';
import procedures from '../pages/forms/list/index';
import procedureDiagram from '../pages/forms/diagram/index';
import procedureStart from '../pages/forms/start/index';
import error from './error/index';
import task from '../pages/task/display';
import tasks from '../pages/tasks/index';
import taskForm from '../pages/task/form';
import reports from '../pages/reports/index';
import cases from '../pages/cases/index';
import caseActions from '../pages/cases/case-actions/index';

import dashboard from '../pages/dashboard';
import appConfigReducer from '../common/appConfigReducer';

export const rootEpic = combineEpics(
  notificationPage.epic,
  shift.epic,
  procedures.epic,
  procedureDiagram.epic,
  procedureStart.epic,
  task.epic,
  tasks.epic,
  taskForm.epic,
  reports.epic,
  dashboard.epic,
  error.epic,
  cases.epic,
  caseActions.epic,
);

export const rootReducer = combineReducers({
  loadingBar: loadingBarReducer,
  routing: routerReducer,
  keycloak: keycloakReducer,
  appConfig: appConfigReducer,
  [notificationPage.NAME]: notificationPage.reducer,
  [shift.NAME]: shift.reducer,
  [procedures.NAME]: procedures.reducer,
  [procedureDiagram.NAME]: procedureDiagram.reducer,
  [procedureStart.constants.NAME]: procedureStart.reducer,
  [error.NAME]: error.reducer,
  [task.NAME]: task.reducer,
  [tasks.NAME]: tasks.reducer,
  [taskForm.constants.NAME]: taskForm.reducer,
  [reports.NAME]: reports.reducer,
  [dashboard.NAME]: dashboard.reducer,
  [cases.NAME]: cases.reducer,
  [caseActions.NAME]: caseActions.reducer,
});
