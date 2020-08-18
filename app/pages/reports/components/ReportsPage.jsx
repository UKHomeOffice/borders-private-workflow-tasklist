import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from 'uuid';
import _ from 'lodash';
import { appConfig, loadingReports, reports } from '../selectors';
import DataSpinner from '../../../core/components/DataSpinner';
import * as actions from '../actions';

export class ReportsPage extends React.Component {
  componentDidMount() {
    const { fetchReportsList } = this.props;
    fetchReportsList();
  }

  render() {
    const {
      appConfig: { productPageUrl },
      loadingReports: reportsLoading,
      reports: reportsList,
    } = this.props;
    const items = [];
    if (reportsList) {
      reportsList.forEach(report => {
        items.push(
          <div id="report" className="govuk-grid-row" key={uuid()}>
            <div className="govuk-grid-column-full govuk-card">
              <h3 className="govuk-heading-m">{report.get('name')}</h3>
              <p id="formDescription" className="govuk-body">
                {report.get('description')}
              </p>
              <div className="govuk-grid-row">
                <div className="govuk-grid-column-one-third">
                  <button
                    id="actionButton"
                    className="govuk-button"
                    onClick={() => {
                      const { history } = this.props;
                      history.push(
                        `/reports/${_.kebabCase(report.get('name'))}`,
                        (report.get('reportType') === 'PowerBIReport' && {
                          accessToken: report.get('accessToken'),
                          embedUrl: report.get('embedUrl'),
                          id: report.get('id'),
                          name: report.get('name'),
                          reportType: report.get('reportType'),
                        }) || {
                          name: report.get('name'),
                          htmlName: report.get('htmlName'),
                        },
                      );
                    }}
                    type="submit"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>,
        );
      });
    }

    return (
      <div>
        <div className="govuk-grid-row" id="reportsCountLabel">
          <div className="govuk-grid-column-one-half">
            <span className="govuk-caption-l">Operational reports</span>
            <h2 className="govuk-heading-l">
              {reportsList.size} {reportsList.size === 1 ? 'report' : 'reports'}
            </h2>
          </div>
        </div>
        {reportsLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '20px',
            }}
          >
            <DataSpinner message="Loading reports" />
          </div>
        ) : (
          <React.Fragment>
            <p className="govuk-body govuk-!-margin-bottom-8">
              See our{' '}
              <a
                href={`${productPageUrl}/help/using-cop-reports/`}
                rel="noopener noreferrer"
                target="_blank"
              >
                reports help guide
              </a>{' '}
              for further information.
            </p>
            {items}
          </React.Fragment>
        )}
      </div>
    );
  }
}

ReportsPage.propTypes = {
  appConfig: PropTypes.shape({
    productPageUrl: PropTypes.string.isRequired,
  }).isRequired,
  fetchReportsList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loadingReports: PropTypes.bool.isRequired,
  reports: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = createStructuredSelector({
  appConfig,
  loadingReports,
  reports,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReportsPage),
);
