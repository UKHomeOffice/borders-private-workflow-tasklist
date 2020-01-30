import React from 'react';
import PropTypes from 'prop-types';
import {
    customEventSubmissionStatus,
    form,
    loadingTaskForm, nextTask, nextVariables,
    submissionResponse,
    submissionStatus
} from '../selectors';
import {bindActionCreators} from 'redux';
import * as taskFormActions from '../actions';
import * as taskActions from '../../display/actions';
import {Formio} from 'react-formio';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import AppConstants from '../../../../common/AppConstants';
import NotFound from '../../../../core/components/NotFound';
import {FAILED, SUBMISSION_SUCCESSFUL, SUBMITTING} from '../constants';
import TaskForm from './TaskForm';
import withLog from '../../../../core/error/component/withLog';
import DataSpinner from '../../../../core/components/DataSpinner';
import {unclaimSuccessful} from '../../display/selectors';

import PubSub from "pubsub-js";
import Immutable from 'immutable';
import Loader from "react-loader-advanced";

const {Map} = Immutable;

export class CompleteTaskForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleCustomEvent = this.handleCustomEvent.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
    }

    componentDidMount() {
        this.props.fetchTaskForm(this.props.task);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {submissionStatus, customEventSubmissionStatus} = this.props;
        if (this.form && this.form.formio) {
            if (submissionStatus !== prevProps.submissionStatus) {
                this.handleSubmission(submissionStatus);
            }
            if (customEventSubmissionStatus !== prevProps.customEventSubmissionStatus
                && customEventSubmissionStatus === SUBMISSION_SUCCESSFUL) {
                this.props.history.replace(AppConstants.YOUR_TASKS_PATH);
            }
            if (this.props.unclaimSuccessful) {
                this.props.history.push(AppConstants.YOUR_TASKS_PATH);
            }
        }
    }


    handleSubmission(submissionStatus) {
        const taskName = this.props.task ? this.props.task.get('name') : (this.props.nextTask ? this.props.nextTask.get('name') : '');
        const path = this.props.history.location.pathname;
        const user = this.props.kc.tokenParsed.email;
        switch (submissionStatus) {
            case SUBMITTING :
                this.props.log([{
                    user: user,
                    path: path,
                    level: 'info',
                    message: `Submitting data for ${taskName}`
                }]);
                break;
            case SUBMISSION_SUCCESSFUL:
                Formio.clearCache();
                if (this.props.submissionResponse && this.props.submissionResponse.task) {
                    const task = this.props.submissionResponse.task;
                    this.props.fetchTaskForm(new Map({
                        id: task.id,
                        formKey: task.formKey,
                        processInstanceId: task.processInstanceId
                    }));
                    this.props.setNextTask(this.props.submissionResponse.task, this.props.submissionResponse.variables);
                } else {
                    const task = this.props.task;
                    PubSub.publish('submission', {
                        submission: true,
                        autoDismiss: true,
                        message: task.get('fromProcedure') && task.get('processName') ? `${task.get('processName')} successfully started` : 'Task successfully completed',
                    });
                    this.form.formio.emit('submitDone');
                    this.props.log([{
                        user: user,
                        path: path,
                        level: 'info',
                        message: `${taskName} successfully completed`
                    }]);
                    if (this.props.redirectPath) {
                        this.props.history.replace(this.props.redirectPath);
                    } else {
                        this.props.history.replace(AppConstants.YOUR_TASKS_PATH);
                    }
                }
                break;
            case FAILED :
                this.props.log([{
                    user: user,
                    path: path,
                    level: 'error',
                    message: `Failed to complete ${taskName}`
                }]);
                this.form.formio.emit('error');
                this.form.formio.emit('change', this.form.formio.submission);
                break;
            default:
                this.props.log([{
                    level: 'warn',
                    path: path,
                    user: user,
                    message: 'Unknown submission status',
                    submissionStatus: submissionStatus
                }]);
        }
    }

    handleCustomEvent = (event, variableName) => {
        const {task} = this.props;
        if (event.type === 'unclaim') {
            this.props.unclaimTask(task.get('id'));
        } else if (event.type === 'cancel') {
            this.props.history.replace(AppConstants.YOUR_TASKS_PATH);
        } else {
            this.props.customEvent(event, task, variableName);
        }
    };

    componentWillUnmount() {
        this.form = null;
        this.props.resetForm();
    }

    render() {
        const {loadingTaskForm, form, fromProcedure, history, submissionStatus, nextTask, nextVariables} = this.props;
        const task = nextTask ? nextTask: this.props.task;
        const variables = nextVariables? nextVariables: this.props.variables;
        if (loadingTaskForm) {
            return <DataSpinner
                message={fromProcedure ? "Loading next form to complete" : "Loading form for task..."}/>;
        }
        if (!form) {
            return <NotFound resource="Form" id={task.get('name')}/>;
        }

        return <Loader show={submissionStatus === SUBMITTING}
                       message={<div style={{
                           justifyContent: 'center',
                           zIndex: 100,
                           borderRadius: 0,
                           position: 'absolute',
                           left: 0,
                           right: 0,
                           top: '-20px',
                           margin: 'auto'
                       }}><DataSpinner
                           message="Submitting data..."/></div>}
                       hideContentOnLoad={submissionStatus === SUBMITTING}
                       foregroundStyle={{color: 'black'}}
                       backgroundStyle={{backgroundColor: 'white'}}><TaskForm
            {...this.props}
            { ...{ form, history, task, variables } }
            onSubmitTaskForm={(submissionData, variableName) => {
                this.props.submitTaskForm(form.id, task.get('id'),
                    submissionData, variableName);
            }}
            onCustomEvent={(event) => this.handleCustomEvent(event)}
            formReference={(form) => this.form = form}/></Loader>
    }
}

CompleteTaskForm.propTypes = {
    submitTaskForm: PropTypes.func,
    customEvent: PropTypes.func,
    fetchTaskForm: PropTypes.func,
    unclaimTask: PropTypes.func,
    resetForm: PropTypes.func,
    loadingTaskForm: PropTypes.bool,
    submissionStatus: PropTypes.string,
    customEventSubmissionStatus: PropTypes.string,
    setNextTask: PropTypes.func
};


const mapDispatchToProps = dispatch => bindActionCreators(Object.assign({}, taskFormActions, taskActions), dispatch);


export default withRouter(connect((state) => {
    return {
        form: form(state),
        loadingTaskForm: loadingTaskForm(state),
        unclaimSuccessful: unclaimSuccessful(state),
        submissionStatus: submissionStatus(state),
        customEventSubmissionStatus: customEventSubmissionStatus(state),
        submissionResponse: submissionResponse(state),
        nextTask: nextTask(state),
        nextVariables: nextVariables(state),
        kc: state.keycloak,
        appConfig: state.appConfig
    };
}, mapDispatchToProps)(withLog(CompleteTaskForm)));
