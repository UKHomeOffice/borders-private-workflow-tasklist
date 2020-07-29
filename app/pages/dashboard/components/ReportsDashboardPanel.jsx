import React from "react";
import {withRouter} from "react-router";
import AppConstants from '../../../common/AppConstants';

export class ReportsDashboardPanel extends React.Component {

  reports(e) {
    e.preventDefault();
    this.props.history.replace({
      pathname: AppConstants.REPORTS_PATH,
      shiftPresent: this.props.hasActiveShift
    });
  }

  render() {
    return (
      <li className="govuk-grid-column-one-third" id="reportsPanel">
        <a 
          href={AppConstants.REPORTS_PATH}
          className="govuk-heading-m govuk-link"
          id="reportsPageLink"
          onClick={e => this.reports(e)}
        >
          Reports
        </a>
        <p className="govuk-body-s">
          Operational reports
        </p>
      </li>
    )
  }
}

export default withRouter(ReportsDashboardPanel);
