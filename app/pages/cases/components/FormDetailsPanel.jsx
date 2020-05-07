import React from 'react';
import {bindActionCreators} from "redux";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {Form} from "react-formio";
import {formSubmissionData, formVersionDetails, loadingFormSubmissionData, loadingFormVersion} from "../selectors";
import withLog from "../../../core/error/component/withLog";
import {getFormVersion, getFormSubmissionData, resetForm} from "../actions";
import GovUKDetailsObserver from "../../../core/util/GovUKDetailsObserver";
import FormioInterpolator from '../../../core/FormioInterpolator'
import secureLocalStorage from '../../../common/security/SecureLocalStorage';

class FormDetailsPanel extends React.Component {

    constructor(props) {
        super(props);
        this.formNode = React.createRef();
        this.formioInterpolator = new FormioInterpolator();
    }

    componentDidMount() {
        this.props.getFormVersion(this.props.formReference.formVersionId);
        this.props.getFormSubmissionData(this.props.businessKey, this.props.formReference.dataPath);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.formVersionDetails && this.formNode.element) {
            this.observer = new GovUKDetailsObserver(this.formNode.element).create();
        }
    }

    componentWillUnmount() {
        this.props.resetForm();
        if (this.observer) {
            this.observer.destroy();
        }
    }

    render() {
        const {
            loadingFormVersion, formVersionDetails,
            loadingFormSubmissionData,
            formSubmissionData
        } = this.props;

        if (loadingFormVersion && loadingFormSubmissionData) {
            return <div style={{justifyContent: 'center', paddingTop: '20px'}}>Loading form...</div>
        }
        if (!formVersionDetails || !formSubmissionData) {
            return <div />;
        }

        this.formioInterpolator.interpolate(formVersionDetails.schema, formSubmissionData);
        return (
          <Form
            form={formVersionDetails.schema}
            submission={{data: formSubmissionData}}
            ref={form => {
                this.formNode = form;
            }}
            options={{
                readOnly: true,
                buttonSettings: {
                    showCancel: false,
                    showPrevious: true,
                    showNext: true,
                    showSubmit: false
                }
            }}
          />
)
    }
}


FormDetailsPanel.propTypes = {
    getFormSubmissionData: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    getFormVersion: PropTypes.func.isRequired,
    loadingFormVersion: PropTypes.bool,
    formVersionDetails: PropTypes.object,
    formReference: PropTypes.shape({
        name: PropTypes.string,
        title: PropTypes.string,
        formVersionId: PropTypes.string,
        dataPath: PropTypes.string,
        submissionDate: PropTypes.string,
        submittedBy: PropTypes.string
    }),
    submissionDataKey: PropTypes.string,
    loadingSubmissionFormData: PropTypes.bool,
    formSubmissionData: PropTypes.object,
    businessKey: PropTypes.string
};

const mapDispatchToProps = dispatch => bindActionCreators({getFormVersion,
        getFormSubmissionData, resetForm},
    dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        loadingFormVersion: loadingFormVersion(state),
        formVersionDetails: formVersionDetails(state),
        loadingSubmissionFormData: loadingFormSubmissionData(state),
        formSubmissionData: formSubmissionData(state),


    }
}, mapDispatchToProps)(withLog(FormDetailsPanel)));
