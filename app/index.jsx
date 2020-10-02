import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import MatomoTracker from 'piwik-react-router';
import Keycloak from 'keycloak-js';
import { Formio } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template';
import qs from 'querystring';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import secureLocalStorage from './common/security/SecureLocalStorage';
import App from './core/App';
import configureStore from './core/store/configureStore';
import 'webpack-icons-installer/bootstrap';
import '../public/styles/app.scss';
import 'govuk-frontend/govuk/core/_typography.scss';
import 'rxjs';
import ScrollToTop from './core/components/ScrollToTop';
import Header from './core/components/Header';
import Footer from './core/components/Footer';
import browserIsSupported from './core/util/browserIsSupported';
import UnavailablePage from './core/components/UnavailablePage';
import UnsupportedPage from './core/components/UnsupportedPage';

const rootDocument = document.getElementById('root');
const store = configureStore();
let kc = null;

Formio.use(gds);

const renderApp = App => {
  const updateLocalStorage = async ({ tokenParsed, token }) => {
    const {
      adelphi_number: adelphi,
      dateofleaving,
      location_id: defaultlocationid,
      email,
      grade_id: gradeid,
      phone,
      team_id: teamid,
      delegate_email: delegateEmails,
      line_manager_email: linemanagerEmail,
      name,
    } = tokenParsed;
    const config = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    let response;

    const fetchTeam = async () => {
      try {
        response = await axios.get(
          `${
            store.getState().appConfig.apiRefUrl
          }/v2/entities/team?filter=id=eq.${teamid}`,
          config,
        );
      } catch (error) {
        console.log('Error fetching team:', error);
      }
      return response.data.data[0];
    };

    const fetchStaffId = async () => {
      try {
        response = await axios.get(
          `${
            store.getState().appConfig.operationalDataUrl
          }/v2/staff?filter=email=eq.${tokenParsed.email}`,
          config,
        );
      } catch (error) {
        console.log('Error fetching staffId:', error);
      }
      return response.data[0].staffid;
    };

    const team = await fetchTeam();
    const staffid = await fetchStaffId();
    const staffDetails = {
      adelphi,
      dateofleaving,
      defaultlocationid,
      email,
      gradeid,
      locationid: defaultlocationid,
      phone,
      staffid,
      teamid,
      defaultteam: team,
      defaultteamid: teamid,
    };
    secureLocalStorage.set(`staffContext::${email}`, staffDetails);
    secureLocalStorage.set('extendedStaffDetails', {
      delegateEmails,
      email,
      linemanagerEmail,
      name,
    });
  };

  kc.onTokenExpired = () => {
    kc.updateToken()
      .success(refreshed => {
        if (refreshed) {
          store.getState().keycloak = kc;
          updateLocalStorage(kc);
        }
      })
      .error(() => {
        kc.logout();
      });
  };

  kc.init({ onLoad: 'login-required', checkLoginIframe: false }).success(
    async authenticated => {
      if (authenticated) {
        store.getState().keycloak = kc;
        await updateLocalStorage(kc);
        Formio.baseUrl = `${store.getState().appConfig.formUrl}`;
        Formio.formsUrl = `${store.getState().appConfig.formUrl}/form`;
        Formio.formUrl = `${store.getState().appConfig.formUrl}/form`;
        Formio.projectUrl = `${store.getState().appConfig.formUrl}`;
        Formio.plugins = [
          {
            priority: 0,
            async preRequest(requestArgs) {
              if (!requestArgs.opts) {
                requestArgs.opts = {};
              }
              if (!requestArgs.opts.header) {
                requestArgs.opts.header = new Headers();
                if (requestArgs.method !== 'upload') {
                  requestArgs.opts.header.set('Accept', 'application/json');
                  requestArgs.opts.header.set(
                    'Content-type',
                    'application/json; charset=UTF-8',
                  );
                } else {
                  requestArgs.opts.header.set(
                    'Content-type',
                    requestArgs.file.type,
                  );
                }
              }
              let { token } = store.getState().keycloak;
              const isExpired =
                jwtDecode(token).exp < new Date().getTime() / 1000;
              if (isExpired) {
                try {
                  const response = await axios({
                    method: 'POST',
                    url: `${kc.authServerUrl}/realms/${kc.realm}/protocol/openid-connect/token`,
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: qs.stringify({
                      grant_type: 'refresh_token',
                      client_id: kc.clientId,
                      refresh_token: kc.refreshToken,
                    }),
                  });
                  token = response.data.access_token;
                } catch (e) {
                  console.error(e);
                }
              }

              requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
              if (!requestArgs.url) {
                requestArgs.url = '';
              }
              requestArgs.url = requestArgs.url.replace('_id', 'id');
              return Promise.resolve(requestArgs);
            },
          },
          {
            priority: 0,
            requestResponse(response) {
              return {
                ok: response.ok,
                json: () =>
                  response.json().then(result => {
                    if (result.forms) {
                      return result.forms.map(form => {
                        form._id = form.id;
                        return form;
                      });
                    }
                    result._id = result.id;
                    return result;
                  }),
                status: response.status,
                headers: response.headers,
              };
            },
          },
        ];
        const history = MatomoTracker({
          url: store.getState().appConfig.analyticsUrl,
          siteId: store.getState().appConfig.analyticsSiteId,
        }).connectToHistory(createBrowserHistory());

        setInterval(() => {
          kc.updateToken()
            .success(refreshed => {
              if (refreshed) {
                store.getState().keycloak = kc;
                updateLocalStorage(kc);
              }
            })
            .error(() => {
              kc.logout();
            });
        }, 3 * 60000);

        ReactDOM.render(
          <Provider store={store}>
            <div>
              <AppContainer>
                <Router history={history}>
                  <ScrollToTop>
                    <App />
                  </ScrollToTop>
                </Router>
              </AppContainer>
            </div>
          </Provider>,
          rootDocument,
        );
      }
    },
  );
};

const unavailable = Comp => {
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AppContainer>
          <BrowserRouter>
            <div>
              <Header />
              <div className="container" style={{ height: '100vh' }}>
                <Comp />
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </AppContainer>
      </div>
    </Provider>,
    rootDocument,
  );
};

const serviceDeskBaseUrl = 'https://support.cop.homeoffice.gov.uk/servicedesk';
const serviceDeskUrls = {
  feedback: `${serviceDeskBaseUrl}/customer/portal/3/create/54`,
  support: `${serviceDeskBaseUrl}/customer/portal/3`,
};

if (process.env.NODE_ENV === 'production') {
  fetch('/api/config')
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(
        `Application configuration could not be loaded: ${response.status} ${response.statusMessage}`,
      );
    })
    .then(data => {
      kc = Keycloak({
        realm: data.KEYCLOAK_REALM,
        url: data.KEYCLOAK_URI,
        clientId: data.WWW_KEYCLOAK_CLIENT_ID,
      });
      store.getState().appConfig = {
        uiVersion: data.WWW_UI_VERSION,
        uiEnvironment: data.WWW_UI_ENVIRONMENT,
        operationalDataUrl: data.API_COP_URI,
        workflowServiceUrl: data.ENGINE_URI,
        formUrl: data.API_FORM_URI,
        reportServiceUrl: data.REPORT_URI,
        attachmentServiceUrl: data.API_ATTACHMENT_URI,
        analyticsUrl: data.ANALYTICS_URL,
        analyticsSiteId: data.ANALYTICS_SITE_ID,
        apiRefUrl: data.API_REF_URI,
        serviceDeskUrls,
        browserVersions: data.BROWSER_VERSIONS,
        detectBrowser: data.DETECT_BROWSER === 'true',
        productPageUrl: data.PRODUCT_PAGE_URI,
      };

      const { detectBrowser, browserVersions } = store.getState().appConfig;
      if (detectBrowser && !browserIsSupported(browserVersions)) {
        unavailable(UnsupportedPage);
      } else {
        renderApp(App);
      }
    })
    .catch(err => {
      console.log('Unable to start application: ', err.message);
      unavailable(UnavailablePage);
    });
} else {
  kc = Keycloak({
    realm: process.env.KEYCLOAK_REALM,
    url: process.env.KEYCLOAK_URI,
    clientId: process.env.WWW_KEYCLOAK_CLIENT_ID,
  });
  store.getState().appConfig = {
    uiVersion: process.env.WWW_UI_VERSION,
    uiEnvironment: process.env.WWW_UI_ENVIRONMENT,
    operationalDataUrl: process.env.API_COP_URI,
    workflowServiceUrl: process.env.ENGINE_URI,
    formUrl: process.env.API_FORM_URI,
    attachmentServiceUrl: process.env.API_ATTACHMENT_URI,
    reportServiceUrl: process.env.REPORT_URI,
    apiRefUrl: process.env.API_REF_URI,
    serviceDeskUrls,
    browserVersions: process.env.BROWSER_VERSIONS,
    detectBrowser: process.env.DETECT_BROWSER === 'true',
    productPageUrl: process.env.PRODUCT_PAGE_URI,
  };
  const { detectBrowser, browserVersions } = store.getState().appConfig;
  if (detectBrowser && !browserIsSupported(browserVersions)) {
    unavailable(UnsupportedPage);
  } else {
    renderApp(App);
  }
}
// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./core/App', () => {
    const NextApp = require('./core/App').default;
    render(NextApp);
  });
}
