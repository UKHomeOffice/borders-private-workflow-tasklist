import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Header} from "./Header";
import secureLocalStorage from "../../common/security/SecureLocalStorage";


export class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const {appConfig} = this.props;
    return <footer className="govuk-footer " role="contentinfo">
          <div className="govuk-width-container ">
            <div className="govuk-footer__meta">
              <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                <h2 className="govuk-visually-hidden">Support links</h2>
                <ul className="govuk-footer__inline-list">
                  <li className="govuk-footer__inline-list-item">
                    <Link className="govuk-footer__link" to="/privacy-policy">Privacy Policy</Link>
                  </li>
                  <li className="govuk-footer__inline-list-item">
                    <Link className="govuk-footer__link" to="/accessibility-statement">Accessibility Statement</Link>
                  </li>
                  <li className="govuk-footer__inline-list-item">
                    <a className="govuk-footer__link" href={`${appConfig.serviceDeskUrls.support}`} target="_blank" rel="noopener noreferrer">Help</a>
                  </li>
                </ul>
              </div>
              <div className="govuk-footer__meta-item">
                <a className="govuk-footer__link govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>
              </div>
            </div>
          </div>
        </footer>;
  }
}


const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default withRouter(connect(state => ({
  kc: state.keycloak,
  appConfig: state.appConfig,
}), mapDispatchToProps)(Footer));
