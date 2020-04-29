import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import SockJS from 'sockjs-client';

import {Client} from '@stomp/stompjs';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce, throttle} from 'throttle-debounce';
import {withRouter} from 'react-router';

import {List} from "immutable";
import * as actions from '../actions';
import DataSpinner from '../../../core/components/DataSpinner';
import YourTasks from './YourTasks';
import {
    filterValueSelector,
    firstPageUrlSelector,
    groupBySelector, isFetchingTasksSelector,
    lastPageUrlSelector,
    nextPageUrlSelector,
    prevPageUrlSelector,
    totalSelector,
    sortValueSelector, tasksSelector,
} from '../selectors';
import secureLocalStorage from "../../../common/security/SecureLocalStorage";
import TaskUtils from "./TaskUtils";


export class YourTasksContainer extends React.Component {
    constructor(props) {
        super(props);
        this.websocketSubscriptions = [];
        this.connect = this.connect.bind(this);
        this.goToTask = this.goToTask.bind(this);
        this.sortYourTasks = this.sortYourTasks.bind(this);
        this.filterTasksByName = this.filterTasksByName.bind(this);
        this.debounceSearch = this.debounceSearch.bind(this);
        this.taskUtils = new TaskUtils();
    }

    componentDidMount() {
        this.loadYourTasks(false, 'sort=due,desc');
        if (secureLocalStorage.get('yourTasksGrouping')) {
            const {groupYourTasks} = this.props;
            groupYourTasks(secureLocalStorage.get('yourTasksGrouping'));
        }
    }


    componentWillUnmount() {
        const { resetYourTasks } = this.props;
        if (this.client) {
            this.client.deactivate();
        }
        resetYourTasks();
    }

    connect = user => {
        const {appConfig} = this.props;
        const uiEnv = appConfig.uiEnvironment.toLowerCase();
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
        this.client.onConnect = function () {
            // eslint-disable-next-line no-unused-vars
            const {log, loadYourTasks, websocketSubscriptions, sortValue, filterValue} = self;
            log([{
                message: 'Connected to websocket',
                user,
                level: 'info',
                path: self.props.location.pathname
            }]);
            const userSub = self.client.subscribe('/user/queue/task', () => {
                loadYourTasks(true, sortValue,
                    filterValue);
            });
            self.websocketSubscriptions.push(userSub);
            log([{
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



    loadYourTasks(skipLoading, yourTasksSortValue, yourTasksFilterValue = null) {
        const { fetchTasksAssignedToYou } = this.props;
        fetchTasksAssignedToYou(yourTasksSortValue, yourTasksFilterValue, skipLoading);
    }

    goToTask(taskId) {
        const { history } = this.props;
        history.replace(`/task/${taskId}?from=yourTasks`);
    }



    debounceSearch(sort, filter) {
        const {fetchTasksAssignedToYou} = this.props;
        if (filter.length <= 2 || filter.endsWith(' ')) {
            throttle(200, () => {
                fetchTasksAssignedToYou(sort, filter, true);
            })();
        } else {
            debounce(500, () => {
                fetchTasksAssignedToYou(sort, filter, true);
            })();
        }
    }

    filterTasksByName(event) {
        event.persist();
        const {sortValue:sort} = this.props;
        this.debounceSearch(sort, event.target.value);
    }

    sortYourTasks(event) {
        const {fetchTasksAssignedToYou, filterValue:filter} = this.props;
        fetchTasksAssignedToYou(event.target.value, filter, true);
    }



    render() {

        const {isFetchingTasks, groupBy, tasks, total, sortValue, filterValue, groupYourTasks} = this.props;

        if (isFetchingTasks) {
            return <DataSpinner message="Fetching tasks assigned to you" />;
        }
        return (
          <YourTasks
            grouping={groupBy}
            paginationActions={
               this.taskUtils.buildPaginationAction(this.props)
            }
            filterTasksByName={this.filterTasksByName}
            sortYourTasks={this.sortYourTasks}
            goToTask={this.goToTask}
            yourTasks={this.taskUtils.applyGrouping(groupBy, tasks.toJS())}
            total={total}
            sortValue={sortValue}
            filterValue={filterValue}
            groupTasks={grouping => {
                    secureLocalStorage.set('yourTasksGrouping', grouping);
                    groupYourTasks(grouping)
                }}
          />
        );
    }
}

YourTasksContainer.defaultProps = {
    isFetchingTasks: true,
    tasks: new List([]),
    total: 0,
    sortValue: 'sort=due,desc',
    filterValue: null,
    groupBy: 'category'
};


YourTasksContainer.propTypes = {
    history: PropTypes.shape({
        replace: PropTypes.func.isRequired
    }).isRequired,
    appConfig: PropTypes.shape({
        uiEnvironment: PropTypes.string.isRequired
    }).isRequired,
    groupBy: PropTypes.string,
    groupYourTasks: PropTypes.func.isRequired,
    resetYourTasks: PropTypes.func.isRequired,
    fetchTasksAssignedToYou: PropTypes.func.isRequired,
    isFetchingTasks: PropTypes.bool,
    tasks: ImmutablePropTypes.list,
    total: PropTypes.number,
    sortValue: PropTypes.string,
    filterValue: PropTypes.string,
};
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(state => ({
    isFetchingTasks: isFetchingTasksSelector(state),
    tasks: tasksSelector(state),
    total: totalSelector(state),
    sortValue: sortValueSelector(state),
    filterValue: filterValueSelector(state),
    groupBy: groupBySelector(state),
    nextPageUrl: nextPageUrlSelector(state),
    prevPageUrl: prevPageUrlSelector(state),
    firstPageUrl: firstPageUrlSelector(state),
    lastPageUrl: lastPageUrlSelector(state),
    appConfig: state.appConfig,
    kc: state.keycloak,
}), mapDispatchToProps)(withRouter(YourTasksContainer));


