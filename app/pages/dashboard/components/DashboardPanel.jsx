import PubSub from 'pubsub-js';
import React, {Suspense} from 'react';
import SockJS from 'sockjs-client';

import { Client, Message } from '@stomp/stompjs';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import DataSpinner from '../../../core/components/DataSpinner';
import withLog from '../../../core/error/component/withLog';

const CasesDashboardPanel = React.lazy(() => import('./CasesDashboardPanel'));
const MessagesPanel = React.lazy(() => import('./MessagesPanel'));
const ProceduresDashboardPanel = React.lazy(() => import('./FormsDashboardPanel'));
const ReportsDashboardPanel = React.lazy(() => import('./ReportsDashboardPanel'));
const TaskCountPanel = React.lazy(() => import('./TaskCountPanel'));

export class DashboardPanel extends React.Component {
  constructor(props) {
    super(props);
    this.websocketSubscriptions = [];
    this.retryCount = 0;
    this.connect = this.connect.bind(this);
  }

  componentDidMount() {
    if (this.props.shift) {
      const user = this.props.kc.tokenParsed.email;
      this.connect(user);
    }
}

  componentWillUnmount() {
    this.retryCount = 0;
    if (this.client) {
      this.client.deactivate();
    }
  }

  connect = user => {
    const uiEnv = this.props.appConfig.uiEnvironment.toLowerCase();
    this.client = new Client({
      debug (str) {
        if (uiEnv === 'development' || uiEnv === 'local') {
            console.log(str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000
    });

    const self = this;
    this.client.webSocketFactory = function () {
        return new SockJS(`${self.props.appConfig.workflowServiceUrl}/ws/workflow/tasks?access_token=${self.props.kc.token}`);
    };
    this.client.onConnect = function(frame) {
      self.props.log([{
        message: 'Connected to websocket',
        user,
        level: 'info',
        path: self.props.location.pathname
      }]);

      const teamSub = self.client.subscribe(`/topic/task/${self.props.shift.get('teamid')}`, msg => {
        PubSub.publishSync("refreshCount", {});
      });
      self.websocketSubscriptions.push(teamSub);

      const userSub = self.client.subscribe(`/user/queue/task`, msg => {
        PubSub.publishSync("refreshCount", {});
      });
      self.websocketSubscriptions.push(userSub);

      self.props.log([{
        message: `Number of subscriptions ${self.websocketSubscriptions.length}`,
        user,
        level: 'info',
        path: self.props.location.pathname
      }]);
    };

    this.client.onStompError = function (frame) {
      self.props.log([{
        message: `Failed to connect ${frame.headers.message}`,
        user,
        level: 'error',
        path: self.props.location.pathname
      }]);
    };
    this.client.activate();
  };

  render() {
    return (
      <div id="dashboardPanel">
        <div className="govuk-grid-row govuk-!-margin-top-4">
          <TaskCountPanel {...this.props} />
          <MessagesPanel {...this.props} />
        </div>
        <Suspense
          fallback={(
            <div style={{display: 'flex', justifyContent: 'center', paddingTop: '20px'}}><DataSpinner
              message="Loading panels..."
            />
            </div>
            )}
        >
          <div className="govuk-grid-row govuk-!-margin-top-4">
            <ProceduresDashboardPanel {...this.props} />
            <ReportsDashboardPanel {...this.props} />
            <CasesDashboardPanel {...this.props} />
          </div>
        </Suspense>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default withRouter(connect(state => {
  return {
    kc: state.keycloak,
    appConfig: state.appConfig
  }
}, mapDispatchToProps)(withLog(DashboardPanel)));
