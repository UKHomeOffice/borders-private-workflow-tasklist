import React from "react";
import {withRouter} from "react-router";
import AppConstants from '../../../common/AppConstants';

export class FormsDashboardPanel extends React.Component {

  procedures(e) {
    e.preventDefault();
    this.props.history.replace({
        pathname: AppConstants.FORMS_PATH, state: {
            shiftPresent: this.props.hasActiveShift
        }
    });
  }

  render() {
    return (
      <li className="govuk-grid-column-one-third" id="proceduresPanel">
        <a 
          href={AppConstants.FORMS_PATH}
          className="govuk-heading-m govuk-link home-promo__link"
          id="proceduresPageLink"
          onClick={e => this.procedures(e)}
        >
          Forms
        </a>
        <p className="govuk-body-s">Submit a form</p>
      </li>
    )
  }
}

export default withRouter(FormsDashboardPanel)
