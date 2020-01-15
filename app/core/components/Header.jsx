import PropTypes from 'prop-types';
import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

// local imports
import AppConstants from "../../common/AppConstants";
import secureLocalStorage from '../../common/security/SecureLocalStorage';


export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.secureLocalStorage = secureLocalStorage;
        this.logout = this.logout.bind(this);
        this.dashboard = this.dashboard.bind(this);
    }

    dashboard(event) {
        event.preventDefault();
        this.props.history.push(AppConstants.DASHBOARD_PATH);
    }

    logout(event) {
        event.preventDefault();
        this.secureLocalStorage.removeAll();
        this.props.kc.logout();
    }

    render() {
        return <header className="govuk-header" role="banner" data-module="header">
            <div className="govuk-header__container govuk-width-container">
                <div className="govuk-header__content" style={{width: '100%'}}>
                    <div className="govuk-grid-row">
                        <div className="govuk-grid-column-one-half">
                            <a
                                id="dashboard"
                                href={AppConstants.DASHBOARD_PATH}
                                onClick={event => this.dashboard(event)}
                                className="govuk-header__link govuk-header__link--service-name"
                            >Central Operations Platform</a>
                        </div>
                        <div className="govuk-grid-column-one-half header-nav">
                            <a
                                id="profile"
                                href={`${AppConstants.SUBMIT_A_FORM}/edit-your-profile`}
                                onClick={(event) => {
                                    event.preventDefault();
                                    this.props.history.replace(`${AppConstants.SUBMIT_A_FORM}/edit-your-profile`)
                                }}
                                className="govuk-header__link header-nav__link"
                            >My profile</a>
                            <a
                                id="support"
                                className="govuk-header__link header-nav__link"
                                href={`${this.props.appConfig.serviceDeskUrls.support}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >Support</a>
                            <a
                                id="logout"
                                href={"/logout"}
                                onClick={this.logout}
                                className="govuk-header__link header-nav__link"
                            >Sign out</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>;
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
