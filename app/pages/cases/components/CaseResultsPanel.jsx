import React from 'react';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes from "prop-types";
import _ from "lodash";
import {getCaseByKey} from '../actions';
import {caseDetails, loadingCaseDetails, loadingNextSearchResults} from "../selectors";
import withLog from "../../../core/error/component/withLog";
import CaseDetailsPanel from "./CaseDetailsPanel";
import DataSpinner from "../../../core/components/DataSpinner";

class CaseResultsPanel extends React.Component {

  componentDidMount() {
    if (this.props.businessKey) {
      this.props.getCaseByKey(this.props.businessKey);
    }
  }

  render() {
    const {
      searching, caseSearchResults,
      businessKeyQuery, loadingCaseDetails, caseDetails,
      loadingNextSearchResults
    } = this.props;

    if (searching) {
      return <h4 className="govuk-heading-s">Searching cases with reference {businessKeyQuery}...</h4>
    }
    if (!caseSearchResults) {
      return <div />
    }
    const hasMoreData = _.has(caseSearchResults._links, 'next');

    if (!caseSearchResults._embedded) {
      caseSearchResults._embedded = {
        cases: []
      }
    }
    const businessKeys = caseSearchResults._embedded.cases.map(c => {
      return (
        <li key={c.businessKey}>
          <a
            className="govuk-link"
            href=""
            onClick={event => {
              event.preventDefault();
              if (this.props.businessKey !== c.businessKey) {
                this.props.getCaseByKey(c.businessKey);
              }
            }}
          >
            {c.businessKey}
          </a>
        </li>
      )
    });

    return (
      <React.Fragment>
        {caseSearchResults && (
          <React.Fragment>
            <h3 className="govuk-heading-m">Search results</h3>
            <p className="govuk-caption-m">Number of cases found</p>
            <h3 className="govuk-heading-m">{caseSearchResults.page.totalElements}</h3>
            {caseSearchResults.page.totalElements > 0 && (
              <ul className="govuk-list">
                {businessKeys}
              </ul>
            )}
            {hasMoreData && (
              <button
                className="govuk-button"
                type="submit"
                disabled={loadingNextSearchResults}
                onClick={event => {
                  event.preventDefault();
                  this.props.loadNext();
                }}
              >
                {loadingNextSearchResults ? 'Loading more' : 'Load more'}
              </button>
            )} 
          </React.Fragment>
        )}
        <div className="govuk-grid-column-three-quarters">
          {loadingCaseDetails && (
            <div style={{justifyContent: 'center', paddingTop: '20px'}}>
              <DataSpinner
                message="Loading case details"
              />
            </div>
          )}
          {/* {caseDetails && <CaseDetailsPanel {...{caseDetails}} />} */}
        </div>
      </React.Fragment>
      )
    }
  }

CaseResultsPanel.propTypes = {
    getCaseByKey: PropTypes.func.isRequired,
    loadNext: PropTypes.func,
    loadingNextSearchResults: PropTypes.bool,
    loadingCaseDetails: PropTypes.bool,
    businessKey: PropTypes.string,
    caseDetails: PropTypes.shape({
        businessKey: PropTypes.string,
        processInstances: PropTypes.arrayOf(PropTypes.object)
    })
};

const mapDispatchToProps = dispatch => bindActionCreators({getCaseByKey}, dispatch);

export default withRouter(connect(state => {
    return {
        kc: state.keycloak,
        appConfig: state.appConfig,
        caseDetails: caseDetails(state),
        loadingCaseDetails: loadingCaseDetails(state),
        loadingNextSearchResults: loadingNextSearchResults(state)

    }
}, mapDispatchToProps)(withLog(CaseResultsPanel)));
