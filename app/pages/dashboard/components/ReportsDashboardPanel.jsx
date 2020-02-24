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
        return <li className="__card govuk-grid-column-one-third" id="reportsPanel" style={{marginBottom: '30px'}}>
            <a href={AppConstants.REPORTS_PATH} onClick={this.reports.bind(this)} className="card__body" id="reportsPageLink">
                <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">Reports</span>
            </a>
            <div className="card__footer">
                <span className="govuk-!-font-size-19">Operational reports</span>
            </div>
        </li>
    }
}

export default withRouter(ReportsDashboardPanel);
