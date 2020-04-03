import React from "react";
import Iframe from "react-iframe";

import queryString from 'query-string';
import {withRouter} from "react-router";
import {connect} from "react-redux";

export class ReportPage extends React.Component {

    render() {

        const params = queryString.parse(this.props.location.search);
        const {reportName} = params;

        return (
          <div>
            <a
              href="#"
              id="backToReports"
              style={{textDecoration: 'none'}}
              className="govuk-link govuk-back-link govuk-!-font-size-19"
              onClick={() => this.props.history.replace('/reports')}
            >Back to reports
            </a>

            <div style={{
                display: 'flex',
                position: 'relative',
                margin: 'auto',
                justifyContent: 'center',
                height: '100vh'
            }}
            >
              <Iframe
                url={`${this.props.appConfig.reportServiceUrl}/api/reports/${reportName}`}
                id="report"
                width="100%"
                height="100%"
                position="relative"
                display="initial"
                allowFullScreen
              />
            </div>
          </div>
)
    }
}

export default withRouter(connect(state => {
    return {
        appConfig: state.appConfig
    };
}, {})(ReportPage));
