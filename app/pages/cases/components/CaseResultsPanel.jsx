import React from 'react';
import {getCaseByKey} from '../actions';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {caseDetails, loadingCaseDetails} from "../selectors";
import {bindActionCreators} from "redux";
import withLog from "../../../core/error/component/withLog";
import PropTypes from "prop-types";
import CaseDetailsPanel from "./CaseDetailsPanel";
import DataSpinner from "../../../core/components/DataSpinner";

class CaseResultsPanel extends React.Component {
    render() {
        const {searching, caseSearchResults, businessKeyQuery, loadingCaseDetails, caseDetails} = this.props;

        if (searching) {
            return <h4 className="govuk-heading-s">Searching cases with reference {businessKeyQuery}...</h4>
        }
        if (!caseSearchResults) {
            return <div/>
        }

        if (caseSearchResults.page.totalElements === 0) {
            return <h4 className="govuk-heading-s">No cases found with with reference {businessKeyQuery}</h4>
        }
        const businessKeys = caseSearchResults._embedded.cases.map(c => {
            return <li key={c.businessKey}><a className="govuk-link" href="" onClick={(event) => {
                event.preventDefault();
                this.props.getCaseByKey(c.businessKey)
            }}>{c.businessKey}</a></li>
        });
        return <div className="govuk-grid-row mt-2">
            <div className="govuk-grid-column-one-quarter mt-1">
                {caseSearchResults ?
                    <React.Fragment>
                        <p className="govuk-body govuk-!-font-weight-bold">Number of cases
                            found: {caseSearchResults.page.totalElements}</p>
                        <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible"/>
                        <ul className="govuk-list">
                            {businessKeys}
                        </ul>
                    </React.Fragment> : null}
            </div>
            <div className="govuk-grid-column-three-quarters mt-4">
                {
                    loadingCaseDetails ? <div style={{justifyContent: 'center', paddingTop: '20px'}}>
                            <DataSpinner
                                message="Loading case details"/></div> :
                        (!caseDetails ? null : <CaseDetailsPanel {...{caseDetails}}/>)
                }

            </div>
        </div>
    }
}

CaseResultsPanel.propTypes = {
    getCaseByKey: PropTypes.func.isRequired,
    loadingCaseDetails: PropTypes.bool,
    caseDetails: PropTypes.shape({
        businessKey: PropTypes.string,
        processInstances: PropTypes.arrayOf(PropTypes.object)
    })
};

const mapDispatchToProps = dispatch => bindActionCreators({getCaseByKey}, dispatch);

export default withRouter(connect((state) => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        caseDetails: caseDetails(state),
        loadingCaseDetails: loadingCaseDetails(state),
    }
}, mapDispatchToProps)(withLog(CaseResultsPanel)));
