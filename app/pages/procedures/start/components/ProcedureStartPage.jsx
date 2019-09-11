import * as React from 'react';
import PropTypes from 'prop-types';
import {form, isFetchingProcessDefinition, loadingForm, processDefinition, submissionStatus,} from '../selectors';
import {bindActionCreators} from 'redux';
import * as actions from '../actions';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Formio} from 'react-formio';
import AppConstants from '../../../../common/AppConstants';

import DataSpinner from '../../../../core/components/DataSpinner';
import Loader from 'react-loader-advanced';
import StartForm from './StartForm';
import NotFound from '../../../../core/components/NotFound';
import secureLocalStorage from '../../../../common/security/SecureLocalStorage';
import withLog from '../../../../core/error/component/withLog';
import {FAILED, SUBMISSION_SUCCESSFUL, SUBMITTING} from '../constants';

export class ProcessStartPage extends React.Component {

    constructor(props) {
        super(props);
        this.secureLocalStorage = secureLocalStorage;
        this.handleSubmission = this.handleSubmission.bind(this);
    }

    componentDidMount() {
        if (this.props.processKey) {
            this.props.fetchProcessDefinition(this.props.processKey);
        } else {
            const {match: {params}} = this.props;
            this.props.fetchProcessDefinition(params.processKey);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.isFetchingProcessDefinition !== prevProps.isFetchingProcessDefinition
            && !this.props.isFetchingProcessDefinition) {
            this.props.fetchForm(this.props.processDefinition.get('formKey'));
        }

        const {submissionStatus} = this.props;
        if (submissionStatus !== prevProps.submissionStatus && (this.form && this.form.formio)) {
            const path = this.props.history.location.pathname;
            const user = this.props.kc.tokenParsed.email;
            const processKey = this.props.processDefinition.getIn(['process-definition', 'key']);
            this.handleSubmission(submissionStatus, user, path, processKey);
        }
    }

    handleSubmission(submissionStatus, user, path, processKey) {
        switch (submissionStatus) {
            case SUBMITTING :
                this.props.log([{
                    user: user,
                    path: path,
                    level: 'info',
                    message: `Submitting data for ${processKey}`
                }]);
                break;
            case SUBMISSION_SUCCESSFUL :
                window.scrollTo(0, 0);
                this.form.formio.emit('submitDone');
                this.secureLocalStorage.removeAll();
                this.props.log([{
                    user: user,
                    path: path,
                    level: 'info',
                    message: `Procedure ${processKey} successfully started`
                }]);
                Formio.clearCache();
                if (this.props.redirectPath) {
                    this.props.history.replace(this.props.redirectPath);
                } else {
                    this.props.history.replace(AppConstants.YOUR_TASKS_PATH);
                }
                break;
            case FAILED :
                this.props.log([{
                    user: user,
                    path: path,
                    level: 'error',
                    message: `Procedure ${processKey} failed to be initiated`
                }]);
                const submission = this.form.formio.submission ? this.form.formio.submission :
                    this.secureLocalStorage.get(this.props.processDefinition.getIn(['process-definition', 'id']));
                this.form.formio.emit('error');
                this.form.formio.emit('change', submission);
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

    handleCustomEvent = (event) => {
        switch (event.type) {
            case 'cancel':
                this.secureLocalStorage.removeAll();
                this.props.history.replace(AppConstants.DASHBOARD_PATH);
                break;
            case 'save-draft':
                break;
            default:
        }
    };

    render() {
        const {processDefinition, submissionStatus, form, loadingForm} = this.props;
        if (loadingForm) {
            return <DataSpinner message="Loading procedure..."/>;
        } else {
            if (!form) {
                return <NotFound resource="Form" id={processDefinition.get('formKey')}/>;
            }
            const procedureKey = processDefinition.getIn(['process-definition', 'key']);
            const variableInput = form.components.find(c => c.key === 'submitVariableName');
            const variableName = variableInput ? variableInput.defaultValue : form.name;
            const process = processDefinition.getIn(['process-definition', 'name']) ?
                processDefinition.getIn(['process-definition', 'name']) : procedureKey;

            return <div>
                {!this.props.noBackLink ? <a href="#" className="govuk-back-link govuk-!-font-size-19"
                                               style={{textDecoration: 'none'}}
                                               onClick={(event) => {
                                                   event.preventDefault();
                                                   this.props.history.replace('/procedures')
                                               }}>Back to procedures</a> : null}

                <Loader show={submissionStatus === SUBMITTING}
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
                            message="Starting procedure..."/></div>}
                        hideContentOnLoad={submissionStatus === SUBMITTING}
                        foregroundStyle={{color: 'black'}}
                        backgroundStyle={{backgroundColor: 'white'}}>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-full">
                            <div>
                                <span className="govuk-caption-l">Operational procedure</span>
                                <h2 className="govuk-heading-l">{processDefinition.getIn(['process-definition', 'name'])}</h2>

                                <StartForm {...this.props}
                                           startForm={form}
                                           formReference={(formLoaded) => {
                                               this.form = formLoaded;
                                               if (this.form) {
                                                   this.form.createPromise.then(() => {
                                                       this.form.formio.on('componentError', (error) => {
                                                           const path = this.props.history.location.pathname;
                                                           const user = this.props.kc.tokenParsed.email;
                                                           this.props.log([{
                                                               user: user,
                                                               path: path,
                                                               level: 'error',
                                                               form: {
                                                                   name: form.name,
                                                                   path: form.path,
                                                                   display: form.display
                                                               },
                                                               message: error.message,
                                                               component: {
                                                                   label: error.component.label,
                                                                   key: error.component.key
                                                               }
                                                           }]);
                                                       })
                                                   })
                                               }

                                           }}
                                           removeAll={this.secureLocalStorage.removeAll()}
                                           submission={this.secureLocalStorage.get(processDefinition.getIn(['process-definition', 'id']))}
                                           dataChange={(instance) => {
                                               this.secureLocalStorage.set(processDefinition.getIn(['process-definition', 'id']), instance.data)
                                           }
                                           }
                                           onCustomEvent={(event) => this.handleCustomEvent(event)}
                                           handleSubmit={(submission) => {
                                               if (this.form && this.form.formio) {
                                                   this.form.formio.submitted = true;
                                                   this.form.formio.submitting = true;
                                               }
                                               this.props.submit(form.id, procedureKey,
                                                   variableName,
                                                   submission.data, process,
                                                   this.props.nonShiftApiCall);
                                           }}
                                />
                            </div>
                        </div>
                    </div>
                </Loader>
            </div>;
        }

    };

    componentWillUnmount() {
        this.props.clearProcessDefinition();
    }

}

ProcessStartPage.propTypes = {
    log: PropTypes.func,
    fetchForm: PropTypes.func,
    fetchProcessDefinition: PropTypes.func.isRequired,
    clearProcessDefinition: PropTypes.func.isRequired,
    submit: PropTypes.func,
    processDefinition: ImmutablePropTypes.map,
    submissionStatus: PropTypes.string,
    noBackLink: PropTypes.bool
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect((state) => {
    return {
        processDefinition: processDefinition(state),
        submissionStatus: submissionStatus(state),
        form: form(state),
        loadingForm: loadingForm(state),
        isFetchingProcessDefinition: isFetchingProcessDefinition(state),
        kc: state.keycloak
    };
}, mapDispatchToProps)(withLog(ProcessStartPage)));
