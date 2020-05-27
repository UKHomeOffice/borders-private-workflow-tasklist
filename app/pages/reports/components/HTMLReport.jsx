import React from 'react';
import PropTypes from 'prop-types';
import Iframe from 'react-iframe';

export default function HTMLReport({ htmlName, reportServiceUrl }) {
  return (
    <Iframe
      url={`${reportServiceUrl}/api/reports/${htmlName}`}
      id="report"
      width="100%"
      height="100%"
      position="relative"
      display="initial"
      allowFullScreen
    />
  );
}

HTMLReport.propTypes = {
  htmlName: PropTypes.string.isRequired,
  reportServiceUrl: PropTypes.string.isRequired,
};
