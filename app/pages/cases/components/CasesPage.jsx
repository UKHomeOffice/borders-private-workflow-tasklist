import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import './CasePages.scss';
import CaseResultsPanel from './CaseResultsPanel';
import { findCasesByKey, resetCase, loadNextSearchResults } from '../actions';
import withLog from '../../../core/error/component/withLog';
import {
  businessKeyQuery,
  caseSearchResults,
  loadingNextSearchResults,
  searching,
  caseDetails,
  loadingCaseDetails, 
} from '../selectors';
import CaseDetailsPanel from "./CaseDetailsPanel";
import DataSpinner from "../../../core/components/DataSpinner";

class CasesPage extends React.Component {
  constructor(props) {
    super(props);
    this.searchForCases = this.searchForCases.bind(this);
    this.state = {
      queryToSearch: ""
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;
    const {businessKey} = params;
    if (businessKey) {
      this.props.findCasesByKey(`"${businessKey}"`);
    }
  }

  componentWillUnmount() {
    this.props.resetCase();
  }

  setSearchQuery(event) {
    const query = event.target.value;
    this.setState({ queryToSearch: query });
    this.searchForCases(event)
  }
  
  searchForCases(event) {
    event.preventDefault();
    const that = this;
    window.history.pushState({}, null, '/cases');
    if (this.state.queryToSearch === '') {
      that.props.resetCase();
    } else {
      that.props.findCasesByKey(this.state.queryToSearch);
    }  
  }


  render() {
    const {
      caseSearchResults,
      searching,
      businessKeyQuery,
      loadingCaseDetails, 
      caseDetails,
      match: { params },
    } = this.props;
    const {businessKey} = params;
    return (
      <React.Fragment>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-full">
            <h1 className="govuk-heading-xl">Find a case</h1>
          </div>
        </div>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-one-quarter">
            <h3 className="govuk-heading-m">Case number search</h3>
            <form>
              <div className="govuk-form-group">
                <label className="govuk-label" htmlFor="bfNumber">
                  COP prefixed number
                </label>
                <span id="bfNumberHint" className="govuk-hint">
                  Enter a COP number in quotes to search for cases e.g. "COP-20200406-24"
                </span>
                <DebounceInput
                  minLength={3}
                  debounceTimeout={1000}
                  spellCheck="false"
                  type="text"
                  className="govuk-input"
                  id="bfNumber"
                  onChange={event => this.setSearchQuery(event)}
                />
              </div>
              <button 
                className="govuk-button" 
                type="submit"
                onClick={event => this.searchForCases(event)}
              >
                Search
              </button>
            </form>
            <hr className="govuk-section-break govuk-section-break--m govuk-section-break--visible" />
            <CaseResultsPanel
              {...{
                businessKey,
                caseSearchResults,
                searching,
                businessKeyQuery,
                loadNext: () => {
                  const links = caseSearchResults._links;
                  if ('next' in links) {
                    const that = this;
                    const nextUrl = links.next.href;
                    _.throttle(that.props.loadNextSearchResults(nextUrl), 300);
                  }
                },
              }}
            />
          </div> 
          <div className="govuk-grid-column-three-quarters">
            {(!loadingCaseDetails && !caseDetails) && (
              <div>
                <p class="govuk-body-l">To view the details of a specific case within COP please enter the COP reference number to the left.</p>
                <p class="govuk-body">For a more detailed search query please use the reporting section within COP or an alternative product such as the Single Intelligence Platform (SIP) or the Criminal Intelligence Database (CID).</p>
                <p class="govuk-body">Please note that all queries are audited.</p>
              </div>
            )}
            {loadingCaseDetails && (
              <div style={{justifyContent: 'center', paddingTop: '20px'}}>
                <DataSpinner
                  message="Loading case details"
                />
              </div>
            )}
            {caseDetails && <CaseDetailsPanel {...{caseDetails}} />}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

CasesPage.propTypes = {
  setBusinessKey: PropTypes.func,
  log: PropTypes.func,
  findCasesByKey: PropTypes.func.isRequired,
  resetCase: PropTypes.func.isRequired,
  loadNextSearchResults: PropTypes.func,
  businessKeyQuery: PropTypes.string,
  searching: PropTypes.bool,
  caseSearchResults: PropTypes.shape({
    _embedded: PropTypes.shape({
      cases: PropTypes.arrayOf(
        PropTypes.shape({
          businessKey: PropTypes.string,
          processInstances: PropTypes.arrayOf(PropTypes.object),
        }),
      ),
    }),
    _links: PropTypes.object,
    page: PropTypes.shape({
      size: PropTypes.number,
      totalElements: PropTypes.number,
      totalPages: PropTypes.number,
      number: PropTypes.number,
    }),
  }),
  loadingCaseDetails: PropTypes.bool,
  caseDetails: PropTypes.shape({
    businessKey: PropTypes.string,
    processInstances: PropTypes.arrayOf(PropTypes.object)
  })
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { findCasesByKey, resetCase, loadNextSearchResults },
    dispatch,
  );

export default withRouter(
  connect(
    state => ({
      kc: state.keycloak,
      appConfig: state.appConfig,
      businessKeyQuery: businessKeyQuery(state),
      caseSearchResults: caseSearchResults(state),
      searching: searching(state),
      loadingNextSearchResults: loadingNextSearchResults(state),
      caseDetails: caseDetails(state),
      loadingCaseDetails: loadingCaseDetails(state),
    }),
    mapDispatchToProps,
  )(withLog(CasesPage)),
);
