import React from 'react';
import Actions from './Actions';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import TaskTitle from './TaskTitle';
import CompleteTaskForm from '../../form/components/CompleteTaskForm';
import * as actions from '../actions';
import PropTypes from 'prop-types';
import {customEventSubmissionStatus, form, submissionStatus} from '../../form/selectors';
import {SUBMITTING} from '../../form/constants';
import DataSpinner from '../../../../core/components/DataSpinner';
import Loader from 'react-loader-advanced';

export class TaskDetailsPage extends React.Component {

    render() {
        const {task, variables, submissionStatus} = this.props;
        const showSubmittingLoader = submissionStatus === SUBMITTING || customEventSubmissionStatus === SUBMITTING;

        const hasFormKey = task && task.get('formKey');
        return <div><Loader
            show={showSubmittingLoader}
            message={<div style={{
                justifyContent: 'center',
                zIndex: 100,
                borderRadius: 0,
                position: 'absolute',
                left: 0,
                right: 0,
                top: '-20px',
                margin: 'auto'
            }}><DataSpinner message={`Completing '${task.get('name')}'`}/></div>}
            hideContentOnLoad={showSubmittingLoader}
            foregroundStyle={{color: 'black'}}
            backgroundStyle={{backgroundColor: 'white'}}>

            <TaskTitle {...this.props} />
            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds" style={{paddingTop: '10px'}}>
                    {hasFormKey ? <CompleteTaskForm task={task} variables={variables}/> :
                        <Actions task={task} variables={variables}/>}
                </div>
            </div>
        </Loader>
        </div>;
    }
}


TaskDetailsPage.propTypes = {
    updateDueDate: PropTypes.func.isRequired,
    submissionStatus: PropTypes.string,
    customEventSubmissionStatus: PropTypes.string,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        submissionStatus: submissionStatus(state),
        customEventSubmissionStatus: customEventSubmissionStatus(state),
        appConfig: state.appConfig,
        form: form(state),
    };
}, mapDispatchToProps)(TaskDetailsPage));
