import React from "react";
import PropTypes from 'prop-types';
import TaskSummaryPage from "./TaskSummaryPage";
import {candidateGroups, isFetchingTask, task, variables} from "../selectors";
import * as actions from "../actions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import ImmutablePropTypes from "react-immutable-proptypes";
import {withRouter} from "react-router";
import DataSpinner from "../../../../core/components/DataSpinner";
import TaskDetailsPage from "./TaskDetailsPage";
import NotFound from "../../../../core/components/NotFound";
import AppConstants from '../../../../common/AppConstants';

class TaskPage extends React.Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        this.taskId = params.taskId;
        this.props.fetchTask(this.taskId);
        document.title = AppConstants.APP_NAME;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { task } = this.props;
        if (prevProps.taskId !== this.props.taskId) {
            this.props.fetchTask(this.props.taskId);
        }
        if (task && task !== prevProps.task) {
            document.title = `${task.isEmpty() ? 'Task not found' : task.get('name')} | ${AppConstants.APP_NAME}`;
        }
    }

    componentWillUnmount() {
        this.taskId = null;
        this.props.clearTask();
    }

    render() {
        const {task, isFetchingTask} = this.props;
        if (isFetchingTask) {
            return <DataSpinner message="Fetching task information"/>
        } else {
            if (task.isEmpty()) {
               return <NotFound resource="Task" id={this.taskId}/>
            }
            return task.get('assignee') && task.get('assignee') === this.props.kc.tokenParsed.email ? <TaskDetailsPage {...this.props} /> : <TaskSummaryPage {...this.props}/>
        }

    }
}

TaskPage.propTypes = {
    fetchTask: PropTypes.func.isRequired,
    clearTask: PropTypes.func.isRequired,
    isFetchingTask: PropTypes.bool,
    task: ImmutablePropTypes.map
};


const mapStateToProps = createStructuredSelector({
    isFetchingTask: isFetchingTask,
    task: task,
    candidateGroups: candidateGroups,
    variables: variables,
    kc: (state) => state.keycloak
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TaskPage));
