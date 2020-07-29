import React from 'react';
import {withRouter} from "react-router";
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
          <li className="__card govuk-grid-column-one-third" id="casesPanel" style={{marginBottom: '30px'}}>
            <a href={AppConstants.CASES_PATH} className="card__body" id="casesPageLink" style={{color: '#005ea5'}} onClick={this.cases.bind(this)}>
              <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">Cases</span>
            </a>
            <div className="card__footer">
              <span className="govuk-!-font-size-19">View active or closed cases</span>
            </div>
          </li>
)
    }
}

export default withRouter(CasesDashboardPanel);
