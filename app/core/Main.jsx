import 'babel-polyfill';

import React, { Suspense, lazy }  from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import AppConstants from '../common/AppConstants';
import DataSpinner from './components/DataSpinner';
import withOnboardingCheck from './shift/withOnboardingCheck';
import withShiftCheck from './shift/withShiftCheck';
import ErrorHandlingComponent from './error/component/ErrorHandlingComponent';
import PrivacyPolicy from './components/PrivacyPolicy';

//onboarding check only
const ShiftPage = withOnboardingCheck(lazy(() => import ('../pages/shift/components/ShiftPage')));

//onboarding and shift check
const DashboardPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/dashboard/components/DashboardPage'))));
const YourTasksContainer = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/tasks/components/YourTasksContainer'))));
const ProceduresPage = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/procedures/list/components/ProceduresPage'))));
const ReportsPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportsPage'))));
const YourGroupTasksContainer = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/tasks/components/YourGroupTasksContainer'))));
const ReportPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportPage'))));
const MessagesPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/messages/components/MessagesPage'))));
const CalendarPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/calendar/components/CalendarPage'))));

const StartProcedurePage = lazy(() => import('../pages/procedures/start/components/ProcedureStartPage'));
const ProcessStartPage = withOnboardingCheck(withShiftCheck(StartProcedurePage));
const ProcessDiagramPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/procedures/diagram/components/ProcessDiagramPage'))));
const TaskPage =  withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/task/display/component/TaskPage'))));


//no checks required
const UnauthorizedPage = lazy(() => import('../core/components/UnauthorizedPage'));
const NoOpDashboardPage = lazy(() => import ('../pages/dashboard/components/NoOpDashboardPage'));


const Main = () => (
  <main style={{paddingTop: '10px'}}>
    <Suspense fallback={<div style={{ justifyContent: 'center'}}><DataSpinner message="Loading routes"/></div>}>
      <Switch>
        <Route name="Privacy Policy" exact path={"/privacy-policy"} component={PrivacyPolicy}/>
        <Route name="Dashboard" exact path={AppConstants.DASHBOARD_PATH} component={() => <DashboardPage />}/>
        <Route name="Shift" exact path={AppConstants.SHIFT_PATH} component={() => <ErrorHandlingComponent skipAuthError={true}><ShiftPage/></ErrorHandlingComponent>}/>
        <Route name="Your tasks" exact path={AppConstants.YOUR_TASKS_PATH} component={() => <YourTasksContainer />}/>
        <Route name="Your group tasks" exact path={AppConstants.YOUR_GROUP_TASKS_PATH} component={() => <YourGroupTasksContainer/>}/>
        <Route name="Procedures" exact path={AppConstants.PROCEDURES_PATH} component={() =><ProceduresPage/>}/>
        <Route name="Reports" exact path={AppConstants.REPORTS_PATH} component={() =><ReportsPage/>} />
        <Route exact path={AppConstants.REPORT_PATH} component={() => <ReportPage/>}/>
        <Route name="Messages" exact path={AppConstants.MESSAGES_PATH} component={() => <MessagesPage/>}/>
        <Route name="Calendar" exact path={AppConstants.CALENDAR_PATH} component={() => <CalendarPage/>}/>
        <Route name="Procedure Start Page" exact path={AppConstants.START_A_PROCEDURE + "/:processKey"} component={() =><ProcessStartPage/>}/>
        <Route name="Procedure Diagram Page" exact path={AppConstants.PROCEDURE_DIAGRAM_PATH + "/:processKey"} component={() =><ProcessDiagramPage/>}/>
        <Route name="Task Details Page" exact path={AppConstants.TASK_PATH + "/:taskId"} component={() =><TaskPage/>}/>
        <Route name="Unauthorized path" exact path={"/unauthorized"} component={() => <UnauthorizedPage/> }/>
        <Route name="On board User" exact path={AppConstants.ONBOARD_USER_PATH} component={() => <ErrorHandlingComponent skipAuthError={true}><StartProcedurePage processKey="onboard-user" noBackLink={true} nonShiftApiCall={true} redirectPath={"/noop-dashboard"}/></ErrorHandlingComponent>} />
        <Route name="No-Op Dashboard" exact path={"/noop-dashboard"} component={() => <NoOpDashboardPage/>} />
        <Redirect to={AppConstants.DASHBOARD_PATH}/>
      </Switch>

    </Suspense>
  </main>
);

export default Main
