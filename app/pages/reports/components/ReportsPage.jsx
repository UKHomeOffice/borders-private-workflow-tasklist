import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import uuid from 'uuid';
import { loadingReports, reports } from '../selectors';
import DataSpinner from '../../../core/components/DataSpinner';
import * as actions from '../actions';

export class ReportsPage extends React.Component {
  componentDidMount() {
    const { fetchReportsList } = this.props;
    fetchReportsList();
  }

  render() {
    const { loadingReports: reportsLoading, reports: reportsList } = this.props;
    const items = [];
    if (reportsList) {
      reportsList.forEach(report => {
        items.push(
          <div id="report" className="govuk-grid-row" key={uuid()}>
            <div className="govuk-grid-column-full govuk-card">
              <h4 className="govuk-heading-s">{report.get('name')}</h4>
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
                        (report.get('reportType') === 'PowerBIReport' &&
                          `/report?accessToken=${report.get(
                            'accessToken',
                          )}&embedUrl=${report.get('embedUrl')}&id=${report.get(
                            'id',
                          )}&name=${report.get(
                            'name',
                          )}&reportType=PowerBIReport`) ||
                          `/report?name=${report.get(
                            'name',
                          )}&htmlName=${report.get('htmlName')}`,
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
          <React.Fragment>{items}</React.Fragment>
        )}
      </div>
    );
  }
}

ReportsPage.propTypes = {
  fetchReportsList: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  loadingReports: PropTypes.bool.isRequired,
  reports: ImmutablePropTypes.list.isRequired,
};

const mapStateToProps = createStructuredSelector({
  reports,
  loadingReports,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReportsPage),
);
