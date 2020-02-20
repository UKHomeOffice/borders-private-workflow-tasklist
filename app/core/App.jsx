import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import DataSpinner from './components/DataSpinner';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './Main';
import withLog from './error/component/withLog';
import { clearAllExceptDefault } from '../common/security/SecureLocalStorage';

const SubmissionBanner = lazy(() => import('./components/SubmissionBanner'));

export class App extends React.Component {
  componentDidMount() {
    const { kc, location, log } = this.props;
    const user = kc.tokenParsed.email;
    log(
      [
        {
          level: 'info',
          user,
          path: location.pathname,
          message: `Route requested ${location.pathname}`,
        },
      ],
    );
  }

  componentDidUpdate(prevProps) {
    const { kc, location: currentLocation, log } = this.props;
    const { location: previousLocation } = prevProps;
    const user = kc.tokenParsed.email;

    if (currentLocation !== previousLocation) {
      clearAllExceptDefault();
      log(
        [
          {
            level: 'debug',
            user,
            path: currentLocation.pathname,
            message: 'cleared secure local storage',
          },
          {
            level: 'info',
            user,
            path: currentLocation.pathname,
            message: `Route changed from ${previousLocation.pathname} to ${currentLocation.pathname}`,
          },
        ],
      );
    }
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <div className="app-container" style={{ height: '100%' }}>
          <AppBanner {...this.props} />
          <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}><DataSpinner message="..." /></div>}>
            <SubmissionBanner />
          </Suspense>
          <Main />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

const AppBanner = props => {
  const { appConfig } = props;
  const environment = () => {
    if (appConfig.uiEnvironment.toLowerCase() !== 'production') {
      return (
        <span>
          <strong className="govuk-tag govuk-phase-banner__content__tag ">
            {appConfig.uiEnvironment}
          </strong>
        </span>
      );
    }
    return null;
  };

  return (
    <div className="govuk-phase-banner">
      <p className="govuk-phase-banner__content">
        <strong className="govuk-tag govuk-phase-banner__content__tag ">
          {appConfig.uiVersion}
        </strong>
        {environment()}
        <span className="govuk-phase-banner__text">
          This is a new service – your <a className="govuk-link" href={`${appConfig.serviceDeskUrls.feedback}`} target="_blank" rel="noopener noreferrer">feedback</a> will help us to improve it.
        </span>
      </p>
    </div>
  );
};

App.propTypes = {
  log: PropTypes.func,
  location: PropTypes.object,
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default withRouter(connect(state => ({
  kc: state.keycloak,
  appConfig: state.appConfig,
}), mapDispatchToProps)(withLog(App)));
