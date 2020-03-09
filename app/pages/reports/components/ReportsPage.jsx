import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadingReports, reports } from '../selectors';
import DataSpinner from '../../../core/components/DataSpinner';
import AppConstants from '../../../common/AppConstants';
import * as actions from '../actions';
import uuid from 'uuid';

export class ReportsPage extends React.Component {
  componentDidMount() {
    document.title = `Operational reports | ${AppConstants.APP_NAME}`;
    this.props.fetchReportsList();
  }

  render() {
    const { loadingReports, reports } = this.props;
    const items = [];
    if (reports) {
      reports.forEach(report => {
        items.push(
            <div
                id="report"
                className="govuk-grid-row"
                key={uuid()}
            >
              <div className="govuk-grid-column-full govuk-card">
                <h4 className="govuk-heading-s">{report.get('name')}</h4>
                <p
                    id="formDescription"
                    className="govuk-body"
                >
                  {report.get('description')}
                </p>
                <div
                    className="govuk-grid-row">
                  <div className="govuk-grid-column-one-third">
                    <button
                        id="actionButton"
                        className="govuk-button"
                        onClick={() => {
                          this.props.history.push(
                            `/report?reportName=${report.get('htmlName')}`,
                        );}}
                        type="submit"
                    >View</button>
                  </div>
                </div>
              </div>
            </div>
        );
      });
    }

    return (
      <div>
        <div className="govuk-grid-row" id="reportsCountLabel">
          <div className="govuk-grid-column-one-half">
            <span className="govuk-caption-l">Operational reports</span>
            <h2 className="govuk-heading-l" >
              {reports.size} {reports.size === 1 ? 'report' : 'reports'}
            </h2>
          </div>
        </div>
        {loadingReports ? (
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
  loadingReports: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  reports,
  loadingReports,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReportsPage),
);
