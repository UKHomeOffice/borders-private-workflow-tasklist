import 'babel-polyfill';

import React, { Suspense, lazy }  from 'react'
import {Redirect, Route, Switch} from 'react-router-dom';
import {Helmet} from "react-helmet";
import AccessibilityStatement from './components/AccessibilityStatement';
import AppConstants from '../common/AppConstants';
import DataSpinner from './components/DataSpinner';
import withOnboardingCheck from './shift/withOnboardingCheck';
import withShiftCheck from './shift/withShiftCheck';
import ErrorHandlingComponent from './error/component/ErrorHandlingComponent';
import PrivacyPolicy from './components/PrivacyPolicy';


const ShiftPage = withOnboardingCheck(lazy(() => import ('../pages/shift/components/ShiftPage')));


const DashboardPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/dashboard/components/DashboardPage'))));
const YourTasksPage = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/tasks/components/YourTasksContainer.jsx'))));
const ProceduresPage = withOnboardingCheck(withShiftCheck(lazy(() => import ('../pages/forms/list/components/FormsListPage'))));
const ReportsPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportsPage'))));
const YourGroupTaskPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/tasks/components/YourGroupTasksContainer.jsx'))));
const ReportPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/reports/components/ReportPage'))));
const MessagesPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/messages/components/MessagesPage'))));
const CalendarPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/calendar/components/CalendarPage'))));
const NonShiftCheckProcedurePage = withOnboardingCheck(lazy(() => import('../pages/forms/start/components/FormsStartPage')));
const ProcessStartPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/forms/start/components/FormsStartPage'))));
const ProcessDiagramPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/forms/diagram/components/ProcessDiagramPage'))));
const TaskPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/task/display/component/TaskPage'))));
const CasesPage = withOnboardingCheck(withShiftCheck(lazy(() => import('../pages/cases/components/CasesPage'))));

const UnauthorizedPage = lazy(() => import('../core/components/UnauthorizedPage'));
const NoOpDashboardPage = lazy(() => import ('../pages/dashboard/components/NoOpDashboardPage'));

export const RouteWithTitle =({ title, ...props }) => {
  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Route {...props} />
    </React.Fragment>
);
};

const Main = () => (
  <main className="govuk-main-wrapper govuk-!-padding-top-3" id="main-content" role="main">
    <Suspense fallback={<div style={{ justifyContent: 'center'}}><DataSpinner message="Loading routes" /></div>}>
      <Switch>
        <RouteWithTitle name="Accessibility Statement" title={`Accessibility Statement | ${AppConstants.APP_NAME}`} exact path="/accessibility-statement" component={AccessibilityStatement} />
        <RouteWithTitle name="Privacy Policy" exact path="/privacy-policy" title={`Privacy Policy | ${AppConstants.APP_NAME}`} component={PrivacyPolicy} />
        <RouteWithTitle name="Dashboard" title={`Operational dashboard | ${AppConstants.APP_NAME}`} exact path={AppConstants.DASHBOARD_PATH} component={() => <DashboardPage />} />
        <RouteWithTitle name="Cases" title={`Case view | ${AppConstants.APP_NAME}`} exact path={AppConstants.CASES_PATH} component={() => <CasesPage />} />
        <RouteWithTitle name="Case" title={`Case view | ${AppConstants.APP_NAME}`} exact path={`${AppConstants.CASES_PATH  }/:businessKey`} component={() => <CasesPage />} />
        <Route name="Shift" exact path={AppConstants.SHIFT_PATH} component={() => <ErrorHandlingComponent skipAuthError><ShiftPage /></ErrorHandlingComponent>} />
        <RouteWithTitle name="Your tasks" title={`Your tasks | ${AppConstants.APP_NAME}`} exact path={AppConstants.YOUR_TASKS_PATH} component={() => <YourTasksPage />} />
        <RouteWithTitle name="Your group tasks" title={`Your team’s tasks | ${AppConstants.APP_NAME}`} exact path={AppConstants.YOUR_GROUP_TASKS_PATH} component={() => <YourGroupTaskPage />} />
        <RouteWithTitle name="Forms" title={`Operational forms | ${AppConstants.APP_NAME}`} exact path={AppConstants.FORMS_PATH} component={() =><ProceduresPage />} />
        <RouteWithTitle name="Reports" title={`Operational reports | ${AppConstants.APP_NAME}`} exact path={AppConstants.REPORTS_PATH} component={() =><ReportsPage />} />
        <RouteWithTitle exact path={`${AppConstants.REPORTS_PATH}/:report`} title={`Operational report | ${AppConstants.APP_NAME}`} component={() => <ReportPage />} />
        <RouteWithTitle name="Messages" title={`Operational messages | ${AppConstants.APP_NAME}`} exact path={AppConstants.MESSAGES_PATH} component={() => <MessagesPage />} />
        <RouteWithTitle name="Calendar" title={`Calendar | ${AppConstants.APP_NAME}`} exact path={AppConstants.CALENDAR_PATH} component={() => <CalendarPage />} />
        <RouteWithTitle name="Procedure Start Page" title={`Operational form | ${AppConstants.APP_NAME}`} exact path={`${AppConstants.SUBMIT_A_FORM  }/:processKey`} component={() =><ProcessStartPage />} />
        <RouteWithTitle name="Procedure Diagram Page" title={`Operational process | ${AppConstants.APP_NAME}`} exact path={`${AppConstants.PROCEDURE_DIAGRAM_PATH  }/:processKey`} component={() =><ProcessDiagramPage />} />
        <RouteWithTitle name="Task Details Page" title={`${AppConstants.APP_NAME}`} exact path={`${AppConstants.TASK_PATH  }/:taskId`} component={() =><TaskPage />} />
        <RouteWithTitle name="Unauthorized path" title={`Unauthorized | ${AppConstants.APP_NAME}`} exact path="/unauthorized" component={() => <UnauthorizedPage />} />
        <RouteWithTitle name="On board User" title={`Operational on-boarding | ${AppConstants.APP_NAME}`} exact path={AppConstants.ONBOARD_USER_PATH} component={() => <ErrorHandlingComponent skipAuthError><NonShiftCheckProcedurePage processKey="onboard-user" noBackLink nonShiftApiCall redirectPath="/noop-dashboard" /></ErrorHandlingComponent>} />
        <RouteWithTitle name="No-Op Dashboard" title={`${AppConstants.APP_NAME}`} exact path="/noop-dashboard" component={() => <NoOpDashboardPage />} />
        <Redirect to={AppConstants.DASHBOARD_PATH} />
      </Switch>
    </Suspense>
  </main>
);

export default Main
