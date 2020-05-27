import React from 'react';
import PropTypes from 'prop-types';
import Report from 'powerbi-report-component';

export default function PowerBIReport({
  accessToken,
  embedUrl,
  id: embedId,
  name: pageName,
}) {
  return (
    <Report
      {...{ accessToken, embedId, embedUrl, pageName }}
      embedType="report"
      permissions="Read"
      reportMode="view"
      style={{ width: '100%', height: '100%' }}
      tokenType="Embed"
    />
  );
}

PowerBIReport.propTypes = {
  accessToken: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};
