import React from 'react';
import {bindActionCreators} from "redux";
import {getFormVersion} from "../actions";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {formVersionDetails, loadingFormVersion} from "../selectors";
import withLog from "../../../core/error/component/withLog";
import PropTypes from "prop-types";
import DataSpinner from "../../../core/components/DataSpinner";
import {Form} from "react-formio";

class FormDetailsPanel extends React.Component {

    componentDidMount() {
        this.props.getFormVersion(this.props.formVersionId)
    }


    render() {
        const {loadingFormVersion, formVersionDetails} = this.props;

        if (loadingFormVersion) {
            return <div style={{justifyContent: 'center', paddingTop: '20px'}}>
                <DataSpinner
                    message="Loading form"/></div>
        }
        if (!formVersionDetails) {
            return <div/>;
        }

        const options = {
            readOnly: true
        };
        return <Form
            form={formVersionDetails.schema}
            options={options}/>
    }
}


FormDetailsPanel.propTypes = {
    getFormVersion: PropTypes.func.isRequired,
    loadingFormVersion: PropTypes.bool,
    formVersionDetails: PropTypes.object,
    formVersionId: PropTypes.string
};

const mapDispatchToProps = dispatch => bindActionCreators({getFormVersion}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        loadingFormVersion: loadingFormVersion(state),
        formVersionDetails: formVersionDetails(state),
    }
}, mapDispatchToProps)(withLog(FormDetailsPanel)));
