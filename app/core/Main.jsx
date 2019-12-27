import 'babel-polyfill';

import React, { Suspense, lazy }  from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import AccessibilityStatement from './components/AccessibilityStatement';
import AppConstants from '../common/AppConstants';
import DataSpinner from './components/DataSpinner';
import withOnboardingCheck from './shift/withOnboardingCheck';
import withShiftCheck from './shift/withShiftCheck';
import ErrorHandlingComponent from './error/component/ErrorHandlingComponent';
import PrivacyPolicy from './components/PrivacyPolicy';
import FormsStartPage from '../pages/forms/start/components/FormsStartPage';


const ShiftPage = withOnboardingCheck(lazy(() => import ('../pages/shift/components/ShiftPage')));


const DashboardPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/dashboard/components/DashboardPage'))));
const YourTasksPage = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/tasks/components/YourTasksContainer'))));
const ProceduresPage = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/forms/list/components/FormsListPage'))));
const ReportsPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportsPage'))));
const YourGroupTaskPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/tasks/components/YourGroupTasksContainer'))));
const ReportPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportPage'))));
const MessagesPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/messages/components/MessagesPage'))));
const CalendarPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/calendar/components/CalendarPage'))));
const NonShiftCheckProcedurePage = withOnboardingCheck(lazy(() => import('../pages/forms/start/components/FormsStartPage')));
const FormStartPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/forms/start/components/FormsStartPage'))));
const ProcessDiagramPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/forms/diagram/components/ProcessDiagramPage'))));
const TaskPage =  withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/task/display/component/TaskPage'))));


const UnauthorizedPage = lazy(() => import('../core/components/UnauthorizedPage'));
const NoOpDashboardPage = lazy(() => import ('../pages/dashboard/components/NoOpDashboardPage'));

const Main = () => (
  <main style={{paddingTop: '10px'}} className="govuk-main-wrapper" id="main-content" role="main">
    <Suspense fallback={<div style={{ justifyContent: 'center'}}><DataSpinner message="Loading routes"/></div>}>
      <Switch>
        <Route exact path={"/accessibility-statement"} component={AccessibilityStatement}/>
        <Route exact path={"/privacy-policy"} component={PrivacyPolicy}/>
        <Route exact path={AppConstants.DASHBOARD_PATH} component={() => <DashboardPage />}/>
        <Route exact path={AppConstants.SHIFT_PATH} component={() => <ErrorHandlingComponent skipAuthError={true}><ShiftPage/></ErrorHandlingComponent>}/>
        <Route exact path={AppConstants.YOUR_TASKS_PATH} component={() => <YourTasksPage />}/>
        <Route exact path={AppConstants.YOUR_GROUP_TASKS_PATH} component={() => <YourGroupTaskPage/>}/>
        <Route exact path={AppConstants.FORMS_PATH} component={() =><ProceduresPage/>}/>
        <Route exact path={AppConstants.REPORTS_PATH} component={() =><ReportsPage/>} />
        <Route exact path={AppConstants.REPORT_PATH} component={() => <ReportPage/>}/>
        <Route exact path={AppConstants.MESSAGES_PATH} component={() => <MessagesPage/>}/>
        <Route exact path={AppConstants.CALENDAR_PATH} component={() => <CalendarPage/>}/>
        <Route exact path={AppConstants.SUBMIT_A_FORM + "/:processKey"} component={FormsStartPage}/>
        <Route exact path={AppConstants.PROCEDURE_DIAGRAM_PATH + "/:processKey"} component={() =><ProcessDiagramPage/>}/>
        <Route exact path={AppConstants.TASK_PATH + "/:taskId"} component={() =><TaskPage/>}/>
        <Route exact path={"/unauthorized"} component={() => <UnauthorizedPage/> }/>
        <Route exact path={AppConstants.ONBOARD_USER_PATH} component={() => <ErrorHandlingComponent skipAuthError={true}><NonShiftCheckProcedurePage processKey="onboard-user" noBackLink={true} nonShiftApiCall={true} redirectPath={"/noop-dashboard"}/></ErrorHandlingComponent>} />
        <Route exact path={"/noop-dashboard"} component={() => <NoOpDashboardPage/>} />
        <Route exact path={AppConstants.VIEW_MANDEC_PATH + "/:processKey/:staffId"} component={FormsStartPage}/>
        <Redirect to={AppConstants.DASHBOARD_PATH}/>
      </Switch>
    </Suspense>
  </main>
);

export default Main
