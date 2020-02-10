import React from 'react';
import {bindActionCreators} from "redux";
import {getFormVersion, getFormSubmissionData} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {formSubmissionData, formVersionDetails, loadingFormSubmissionData, loadingFormVersion} from "../selectors";
import withLog from "../../../core/error/component/withLog";
import PropTypes from "prop-types";
import {Form} from "react-formio";

class FormDetailsPanel extends React.Component {

    componentDidMount() {

        this.props.getFormVersion(this.props.formReference.versionId);
    }

    render() {
        const {loadingFormVersion, formVersionDetails} = this.props;

        if (loadingFormVersion) {
            return <div style={{justifyContent: 'center', paddingTop: '20px'}}>Loading form...</div>
        }
        if (!formVersionDetails) {
            return <div/>;
        }

        return <Form
            form={formVersionDetails.schema}
            options={{
                readOnly: true,
                buttonSettings: {
                    showCancel: false,
                    showPrevious: true,
                    showNext: true,
                    showSubmit: false
                }
            }}/>
    }
}


FormDetailsPanel.propTypes = {
    getFormSubmissionData: PropTypes.func.isRequired,
    getFormVersion: PropTypes.func.isRequired,
    loadingFormVersion: PropTypes.bool,
    formVersionDetails: PropTypes.object,
    formVersionId: PropTypes.string,
    submissionDataKey: PropTypes.string,
    loadingSubmissionFormData: PropTypes.bool,
    formSubmissionData: PropTypes.object,
    businessKey: PropTypes.string
};

const mapDispatchToProps = dispatch => bindActionCreators({getFormVersion, getFormSubmissionData},
    dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        loadingFormVersion: loadingFormVersion(state),
        formVersionDetails: formVersionDetails(state),
        loadingSubmissionFormData: loadingFormSubmissionData(state),
        formSubmissionData: formSubmissionData(state)


    }
}, mapDispatchToProps)(withLog(FormDetailsPanel)));
