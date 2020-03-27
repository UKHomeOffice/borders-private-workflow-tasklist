import React from 'react';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../../core/shift/actions';


export class NoOpDashboardPage extends React.Component {

  render() {
      return (
        <div className="govuk-grid-row" style={{ width: '100%', height: '230px' }}>
          <div className="govuk-grid-column-full">
            <span className="govuk-caption-l">{this.props.kc.tokenParsed.given_name} {this.props.kc.tokenParsed.family_name}</span>
            <h2 className="govuk-heading-l">
                    Operational dashboard
            </h2>
          </div>
          <div className="govuk-grid-column-full">
            <p className="govuk-body">Your onboarding onto COP is complete. We have sent you a confirmation email and text.</p>
            <h2 className="govuk-heading-m">What happens next</h2>
            <p className="govuk-body">To access the various forms on COP <a href="#" className="govuk-link govuk-link--no-visited-state" onClick={e => {this.props.history.replace("/dashboard")}}>click here</a> to continue.</p>
          </div>
        </div>
);
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default withRouter(connect(state => ({
        kc: state.keycloak
    }), mapDispatchToProps)(NoOpDashboardPage));

