import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import SockJS from 'sockjs-client';

import {Client} from '@stomp/stompjs';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce, throttle} from 'throttle-debounce';
import {withRouter} from 'react-router';

import _ from "lodash";
import moment from 'moment';
import * as actions from '../actions';
import DataSpinner from '../../../core/components/DataSpinner';
import YourTasks from './YourTasks';
import {yourTasks} from '../selectors';
import {priority} from "../../../core/util/priority";
import secureLocalStorage from "../../../common/security/SecureLocalStorage";
import TaskUtils from "./TaskUtils";

export class YourTasksContainer extends React.Component {
    constructor(props) {
        super(props);
        this.websocketSubscriptions = [];
        this.retryCount = 0;
        this.connect = this.connect.bind(this);
        this.goToTask = this.goToTask.bind(this);
        this.sortYourTasks = this.sortYourTasks.bind(this);
        this.filterTasksByName = this.filterTasksByName.bind(this);
        this.debounceSearch = this.debounceSearch.bind(this);
        this.taskUtils = new TaskUtils();
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
        this.client.onConnect = function (frame) {
            self.props.log([{
                message: 'Connected to websocket',
                user,
                level: 'info',
                path: self.props.location.pathname
            }]);

            const userSub = self.client.subscribe('/user/queue/task', () => {
                this.loadYourTasks(true, self.props.yourTasks.get('yourTasksSortValue'),
                    self.props.yourTasks.get('yourTasksFilterValue'));
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

    componentDidMount() {
        this.loadYourTasks(false, 'sort=due,desc');
        if (secureLocalStorage.get('yourTasksGrouping')) {
            this.props.groupYourTasks(secureLocalStorage.get('yourTasksGrouping'));
        }
    }


    loadYourTasks(skipLoading, yourTasksSortValue, yourTasksFilterValue = null) {
        this.props.fetchTasksAssignedToYou(yourTasksSortValue, yourTasksFilterValue, skipLoading);
    }

    goToTask(taskId) {
        this.props.history.replace(`/task/${taskId}?from=yourTasks`);
    }

    componentWillUnmount() {
        if (this.client) {
            this.client.deactivate();
        }
        this.props.resetYourTasks();
    }

    debounceSearch(sortValue, filterValue) {
        if (filterValue.length <= 2 || filterValue.endsWith(' ')) {
            throttle(200, () => {
                this.props.fetchTasksAssignedToYou(sortValue, filterValue, true);
            })();
        } else {
            debounce(500, () => {
                this.props.fetchTasksAssignedToYou(sortValue, filterValue, true);
            })();
        }
    }

    filterTasksByName(event) {
        event.persist();
        const {yourTasks} = this.props;
        this.debounceSearch(yourTasks.get('yourTasksSortValue'), event.target.value);
    }

    sortYourTasks(event) {
        this.props.fetchTasksAssignedToYou(event.target.value,
            this.props.yourTasks.get('yourTasksFilterValue'), true);
    }

    render() {
        const {yourTasks} = this.props;

        if (yourTasks.get('isFetchingTasksAssignedToYou')) {
            return <DataSpinner message="Fetching tasks assigned to you" />;
        }
        const groupBy = yourTasks.get('groupBy');
        return (
          <YourTasks
            grouping={groupBy}
            filterTasksByName={this.filterTasksByName}
            sortYourTasks={this.sortYourTasks}
            goToTask={this.goToTask}
            yourTasks={this.taskUtils.applyGrouping(groupBy, yourTasks.get('tasks').toJS())}
            total={yourTasks.get('total')}
            sortValue={yourTasks.get('sortValue')}
            filterValue={yourTasks.get('yourTasksFilterValue')}
            groupTasks={grouping => {
                    secureLocalStorage.set('yourTasksGrouping', grouping);
                    this.props.groupYourTasks(grouping)
                }}
          />
        );
    }
}

YourTasksContainer.propTypes = {
    groupBy: PropTypes.string,
    groupYourTasks: PropTypes.func,
    resetYourTasks: PropTypes.func,
    fetchTasksAssignedToYou: PropTypes.func.isRequired,
    yourTasks: ImmutablePropTypes.map,
};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(state => ({
    yourTasks: yourTasks(state),
    appConfig: state.appConfig,
    kc: state.keycloak,
}), mapDispatchToProps)(withRouter(YourTasksContainer));
