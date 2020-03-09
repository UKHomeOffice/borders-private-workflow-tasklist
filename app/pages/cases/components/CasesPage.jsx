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
    const businessKey = params.businessKey;
    if (businessKey) {
      this.props.findCasesByKey(businessKey.toUpperCase());
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
    const businessKey = params.businessKey;
    return (
      <React.Fragment>
        <div className="govuk-grid-row">
          <div className="govuk-grid-column-two-thirds">
            <span className="govuk-caption-l">Case view</span>
            <h2 className="govuk-heading-l">
              Cases
            </h2>
            <div className="govuk-inset-text">
              Enter a BF number to search for cases.{' '}
              <strong>Please note all actions are audited.</strong>
            </div>
          </div>
          <div className="govuk-grid-column-one-third">
            <div className="govuk-form-group input-icon">
              <DebounceInput
                minLength={3}
                debounceTimeout={500}
                spellCheck="false"
                type="text"
                className="govuk-input"
                placeholder="Search using a BF prefixed number"
                id="bfNumber"
                onChange={event => {
                  const that = this;
                  const query = event.target.value;
                  window.history.pushState({}, null, '/cases');
                  if (query === '') {
                    that.props.resetCase();
                  } else {
                    that.props.findCasesByKey(query.toUpperCase());
                  }
                }}
              />
              <i className="fa fa-search fa-lg" style={{ marginLeft: '5px' }} />
            </div>
          </div>
        </div>
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
