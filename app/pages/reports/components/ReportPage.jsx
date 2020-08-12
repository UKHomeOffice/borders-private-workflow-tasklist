import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import AppConstants from '../../../common/AppConstants';
import HTMLReport from './HTMLReport';
import PowerBIReport from './PowerBIReport';

export const ReportPage = ({ appConfig, location }) => {
  if (!location.state) return <Redirect to={AppConstants.REPORTS_PATH} />;
  const { reportServiceUrl } = appConfig;
  const {
    accessToken,
    embedUrl,
    htmlName,
    id,
    name,
    reportType,
  } = location.state;
  const useMobileLayout = window.innerWidth < AppConstants.MOBILE_WIDTH;
  document.title = `${name} | ${AppConstants.APP_NAME}`;

  return (
    <div>
      <Link
        id="backToReports"
        className="govuk-link govuk-back-link govuk-!-font-size-19"
        to="/reports"
      >
        Back to reports
      </Link>

      <div
        style={{
          height: useMobileLayout ? '50vh' : '50vw',
          margin: 'auto',
          maxHeight: useMobileLayout ? null : '70vmin',
          position: 'relative',
        }}
      >
        {reportType === 'PowerBIReport' ? (
          <PowerBIReport
            {...{ accessToken, embedUrl, id, name, useMobileLayout }}
          />
        ) : (
          <HTMLReport {...{ htmlName, reportServiceUrl }} />
        )}
      </div>
    </div>
  );
};

ReportPage.propTypes = {
  appConfig: PropTypes.shape({
    reportServiceUrl: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.shape({
      accessToken: PropTypes.string,
      embedUrl: PropTypes.string,
      htmlName: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string.isRequired,
      reportType: PropTypes.string,
    }),
  }).isRequired,
};

export default withRouter(
  connect(
    state => ({
      appConfig: state.appConfig,
    }),
    {},
  )(ReportPage),
);
