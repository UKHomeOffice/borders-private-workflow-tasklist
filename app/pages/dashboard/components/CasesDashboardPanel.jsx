import React from 'react';
import { withRouter } from "react-router";
import AppConstants from '../../../common/AppConstants';

export class CasesDashboardPanel extends React.Component {

  cases(e) {
    e.preventDefault();
    this.props.history.replace({
      pathname: AppConstants.CASES_PATH,
      shiftPresent: this.props.hasActiveShift
    });
  }

  render() {
    return (
      <div className="govuk-grid-column-one-third" id="casesPanel">
        <a 
          href={AppConstants.CASES_PATH} 
          className="govuk-heading-m govuk-link"
          id="casesPageLink"
          onClick={e => this.cases(e)}
        >
            Cases
        </a>
        <p className="govuk-body-s">
            View active or closed cases
        </p>
      </div>
    )
  }
}

export default withRouter(CasesDashboardPanel);
