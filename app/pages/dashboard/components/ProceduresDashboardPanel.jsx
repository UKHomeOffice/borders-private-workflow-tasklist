import React from "react";
import {withRouter} from "react-router";
import AppConstants from "../../../common/AppConstants";

export class ProceduresDashboardPanel extends React.Component {


    procedures(e) {
        e.preventDefault();
        this.props.history.replace({
            pathname: AppConstants.PROCEDURES_PATH, state: {
                shiftPresent: this.props.hasActiveShift
            }
        });
    }

    render() {
        return <li className="__card govuk-grid-column-one-third" id="proceduresPanel" style={{marginBottom: '30px'}}>
            <a href="#" onClick={this.procedures.bind(this)} className="card__body" id="proceduresPageLink">
                <span className="govuk-!-font-size-36 govuk-!-font-weight-bold">Forms</span>
            </a>
            <div className="card__footer">
                <span className="govuk-!-font-size-19">Submit a form</span>
            </div>
        </li>
    }
}

export default withRouter(ProceduresDashboardPanel)
