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
} from '../selectors';

class CasesPage extends React.Component {
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

  render() {
    const {
      caseSearchResults,
      searching,
      businessKeyQuery,
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
                  onChange={event => {
                    const that = this;
                    const query = event.target.value;
                    window.history.pushState({}, null, '/cases');
                    if (query === '') {
                      that.props.resetCase();
                    } else {
                      that.props.findCasesByKey(query);
                    }
                  }}
                />
              </div>
              <button 
                className="govuk-button" 
                type="submit"
                onClick={event => {
                  event.preventDefault();
                  const that = this;
                  const query = event.target.value;
                  window.history.pushState({}, null, '/cases');
                  that.props.findCasesByKey(query);
                }}
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
    }),
    mapDispatchToProps,
  )(withLog(CasesPage)),
);
