import PropTypes from 'prop-types';
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { withRouter, Link } from 'react-router-dom';

// local imports
import AppConstants from "../../common/AppConstants";
import secureLocalStorage from '../../common/security/SecureLocalStorage';
import SkipLink from './SkipLink';
import './Header.scss';


export class Header extends React.Component {
  constructor(props) {
      super(props);
      this.secureLocalStorage = secureLocalStorage;
      this.logout = this.logout.bind(this);
      this.dashboard = this.dashboard.bind(this);
      this.state = {
        navMobileActive: false,
        navData: [
          {
            id: 'home',
            urlStem: AppConstants.DASHBOARD_PATH,
            text: 'Home',
            active: false,
          },
          {
            id: 'tasks',
            urlStem: AppConstants.YOUR_TASKS_PATH,
            text: 'Tasks',
            active: false,
          },
          {
            id: 'forms',
            urlStem: AppConstants.FORMS_PATH,
            text: 'Forms',
            active: false,
          },
          {
            id: 'cases',
            urlStem: AppConstants.CASES_PATH,
            text: 'Cases',
            active: false,
          },
          {
            id: 'reports',
            urlStem: AppConstants.REPORTS_PATH,
            text: 'Reports',
            active: false,
          },
          {
            id: 'profile',
            urlStem: AppConstants.MY_PROFILE_PATH,
            text: 'My profile',
            active: false,
          },
        ]
      }
  }

  setActivePage(url) {
    const tempArr = [...this.state.navData];
    tempArr.map(elem => {
      const currentUrl = !url ? this.location.pathname : url;
      if (currentUrl === elem.urlStem) {
        elem.active = true;
        document.activeElement.blur();
      } else {
        elem.active = false;
      }
    });
    this.setState({ navData: tempArr });
  };

  dashboard(event) {
      event.preventDefault();
      this.props.history.push(AppConstants.DASHBOARD_PATH);
  }

  toggleNav(event) {
    event.preventDefault();
    const stateChange = this.state.navMobileActive = !this.state.navMobileActive
    this.setState({ navMobileActive: stateChange })
  }

  logout(event) {
      event.preventDefault();
      this.secureLocalStorage.removeAll();
      this.props.kc.logout();
  }

  render() {
      return (
        <header className="govuk-header " role="banner" data-module="header">
          <SkipLink />
          <div className="govuk-header__container govuk-width-container">
            <div className="govuk-header__content">
              <Link 
                id='serviceName'
                to={AppConstants.DASHBOARD_PATH}
                className="govuk-header__link govuk-header__link--service-name"
              >
                {AppConstants.APP_NAME}
              </Link>
              <button 
                type="button" 
                className={this.state.navMobileActive === true ? 'govuk-header__menu-button govuk-js-header-toggle govuk-header__menu-button--open' : 'govuk-header__menu-button govuk-js-header-toggle'}
                // className="govuk-header__menu-button govuk-js-header-toggle" 
                aria-controls="navigation" 
                aria-label="Show or hide Top Level Navigation"
                onClick={event => this.toggleNav(event)}
              >
                Menu
              </button>
              <nav>
                <ul 
                  id="navigation" 
                  className={this.state.navMobileActive === true ? "govuk-header__navigation govuk-header__navigation--open" : "govuk-header__navigation"}
                  aria-label="Top Level Navigation"
                >
                  {(this.state.navData).map(elem => {
                    const activeState = elem.active === true ? 'govuk-header__navigation-item--active' : '';
                    return (
                      <li className={`govuk-header__navigation-item ${activeState}`} key={elem.urlStem}>
                        <Link to={elem.urlStem} className="govuk-header__link" onClick={() => this.setActivePage(elem.urlStem)}>{elem.text}</Link>
                      </li>
                    );
                  })}
                  <li className="govuk-header__navigation-item">
                    <a 
                      id='support'
                      className="govuk-header__link" 
                      href={AppConstants.SUPPORT_PATH}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Support
                    </a>
                  </li>
                  <li className="govuk-header__navigation-item">
                    <Link
                      id='logout'
                      className="govuk-header__link" 
                      onClick={this.logout}
                    >
                      Sign out
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
      );
    }
  }

Header.propTypes = {
history: PropTypes.shape({
    push: PropTypes.func,
}).isRequired,
kc: PropTypes.shape({
    logout: PropTypes.func,
}).isRequired,
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default withRouter(connect(state => ({
kc: state.keycloak,
appConfig: state.appConfig,
}), mapDispatchToProps)(Header));

