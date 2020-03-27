import React from 'react';
import {bindActionCreators} from 'redux';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Loader from 'react-loader-advanced';
import Actions from './Actions';
import TaskTitle from './TaskTitle';
import CompleteTaskForm from '../../form/components/CompleteTaskForm';
import * as actions from '../actions';
import {customEventSubmissionStatus, form, submissionStatus} from '../../form/selectors';
import {SUBMITTING} from '../../form/constants';
import DataSpinner from '../../../../core/components/DataSpinner';
import Comments from "./Comments";
import {isUpdatingTask} from "../selectors";

export class TaskDetailsPage extends React.Component {

    render() {
        const {task, variables, submissionStatus, extensionData, customEventSubmissionStatus} = this.props;
        const showSubmittingLoader = submissionStatus === SUBMITTING || customEventSubmissionStatus === SUBMITTING;

        const hasFormKey = task && task.get('formKey');
        const allowComments = extensionData ? (typeof extensionData.get('allowComments') === "boolean" ? extensionData.get('allowComments'):
            extensionData.get('allowComments') === 'true') : false;

        return (
          <div><Loader
            show={showSubmittingLoader}
            message={(
              <div style={{
                justifyContent: 'center',
                zIndex: 100,
                borderRadius: 0,
                position: 'absolute',
                left: 0,
                right: 0,
                top: '-20px',
                margin: 'auto'
            }}
              ><DataSpinner message={`Completing '${task.get('name')}'`} />
              </div>
)}
            hideContentOnLoad={showSubmittingLoader}
            foregroundStyle={{color: 'black'}}
            backgroundStyle={{backgroundColor: 'white'}}
          >

            <TaskTitle {...this.props} />
            <div className="govuk-grid-row govuk-!-padding-top-3">
              <div className={allowComments ? "govuk-grid-column-two-thirds" : 'govuk-grid-column-full'}>
                {hasFormKey ? <CompleteTaskForm task={task} variables={variables} /> : (
                  <React.Fragment>
                    <p className="govuk-body-l">{task.get('description')}</p>
                    <Actions task={task} variables={variables} />
                  </React.Fragment>
                      )}
              </div>
              {allowComments ? (
                <div className="govuk-grid-column-one-third">
                  <Comments taskId={task.get('id')} {...this.props} />
                </div>
) : null}

            </div>
          </Loader>
          </div>
);
    }
}


TaskDetailsPage.propTypes = {
    updateTask: PropTypes.func.isRequired,
    submissionStatus: PropTypes.string,
    customEventSubmissionStatus: PropTypes.string,
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        submissionStatus: submissionStatus(state),
        isUpdatingTask: isUpdatingTask(state),
        customEventSubmissionStatus: customEventSubmissionStatus(state),
        appConfig: state.appConfig,
        form: form(state),
    };
}, mapDispatchToProps)(TaskDetailsPage));
