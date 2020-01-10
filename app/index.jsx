import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';
import MatomoTracker from 'piwik-react-router';
import Keycloak from 'keycloak-js';
import App from './core/App';
import configureStore from './core/store/configureStore';
import 'webpack-icons-installer/bootstrap';
import '../public/styles/app.scss';
import 'govuk-frontend/govuk/core/_typography.scss';
import 'rxjs';
import AppConstants from './common/AppConstants';
import ScrollToTop from './core/components/ScrollToTop';
import Header from './core/components/Header';
import Footer from './core/components/Footer';
import UnauthorizedPage from './core/components/UnauthorizedPage';
import UnavailablePage from './core/components/UnavailablePage';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import { Formio } from 'react-formio';
import gds from '@digitalpatterns/formio-gds-template';
import secureLocalStorage from './common/security/SecureLocalStorage';
import qs from "querystring";
import axios from 'axios';
import jwt_decode from "jwt-decode";

const store = configureStore();
let kc = null;

Formio.use(gds);


const renderApp = (App, config) => {
  kc.onTokenExpired = () => {
    kc.updateToken().success(refreshed => {
      if (refreshed) {
        store.getState().keycloak = kc;
      }
    }).error(() => {
      kc.logout();
    });
  };

  kc.init({ onLoad: 'login-required', checkLoginIframe: false }).success(authenticated => {
    if (authenticated) {
      store.getState().keycloak = kc;

      Formio.baseUrl = `${config.formApi.url}`;
      Formio.formsUrl = `${config.formApi.url}/form`;
      Formio.formUrl = `${config.formApi.url}/form`;
      Formio.projectUrl = `${config.formApi.url}`;
      Formio.plugins = [
        {
          priority: 0,
          preRequest: async function (requestArgs) {
            if (!requestArgs.opts) {
              requestArgs.opts = {};
            }
            if (!requestArgs.opts.header) {
              requestArgs.opts.header = new Headers();
              if (requestArgs.method !== 'upload') {
                requestArgs.opts.header.set('Accept', 'application/json');
                requestArgs.opts.header.set('Content-type', 'application/json; charset=UTF-8');
              } else {
                requestArgs.opts.header.set('Content-type', requestArgs.file.type);
              }
            }
            let token = store.getState().keycloak.token;
            const isExpired = jwt_decode(token).exp < new Date().getTime() / 1000;
            if (isExpired) {
              try {
                const response = await axios({
                  method: 'POST',
                  url: `${kc.authServerUrl}/realms/${kc.realm}/protocol/openid-connect/token`,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: qs.stringify({
                    grant_type: 'refresh_token',
                    client_id: kc.clientId,
                    refresh_token: kc.refreshToken
                  })
                });
                token = response.data.access_token;
              } catch (e) {
                console.error(e);
              }
            }

            requestArgs.opts.header.set('Authorization', `Bearer ${token}`);
            if (!requestArgs.url) {
                requestArgs.url = "";
            }
            requestArgs.url = requestArgs.url.replace("_id", "id");
            return Promise.resolve(requestArgs);
        },
        },
        {
          priority: 0,
          requestResponse: function (response) {
            return {
              ok: response.ok,
              json: () => response.json().then((result) => {
                if (result.forms) {
                  return result.forms.map((form) => {
                    form['_id'] = form.id;
                    return form;
                  });
                }
                result['_id'] = result.id;
                return result;
              }),
              status: response.status,
              headers: response.headers
            };
          }
        }
      ];
      const rootDocument = document.getElementById('root');
      const history = MatomoTracker({
        url: store.getState().appConfig.analyticsUrl,
        siteId: store.getState().appConfig.analyticsSiteId,
        clientTrackerName: 'matomo.js'
      }).connectToHistory(createBrowserHistory());

      setInterval(() => {
        kc.updateToken().success(refreshed => {
          if (refreshed) {
            store.getState().keycloak = kc;
          }
        }).error(() => {
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
  });
};

const unavailable = () => {
  const rootDocument = document.getElementById('root');
  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AppContainer>
          <BrowserRouter>
            <div>
              <Header />
              <div className="container" style={{ height: '100vh' }}>
                <UnavailablePage />
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

if (process.env.NODE_ENV === 'production') {
  fetch('/api/config')
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Application configuration could not be loaded: ${response.status} ${response.statusMessage}`);
    }).then(data => {
      kc = Keycloak({
        realm: data.REALM,
        url: data.AUTH_URL,
        clientId: data.CLIENT_ID,
      });
      store.getState().appConfig = {
        uiVersion: data.UI_VERSION,
        uiEnvironment: data.UI_ENVIRONMENT,
        operationalDataUrl: data.OPERATIONAL_DATA_URL,
        workflowServiceUrl: data.WORKFLOW_SERVICE_URL,
        formUrl: data.API_FORM_URL,
        reportServiceUrl: data.REPORT_SERVICE_URL,
        analyticsUrl: data.ANALYTICS_URL,
        analyticsSiteId: data.ANALYTICS_SITE_ID,
      };
      renderApp(App, { formApi: { url: data.API_FORM_URL }});
    }).catch(err => {
      console.log('Unable to start application: ', err.message);
      unavailable();
    });
} else {
  const authAccessRole = process.env.WWW_KEYCLOAK_ACCESS_ROLE;
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
    reportServiceUrl: process.env.REPORT_URI
  };
  renderApp(App, { formApi: { url: process.env.API_FORM_URI }});
}
// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./core/App', () => {
    const NextApp = require('./core/App').default;
    render(NextApp);
  });
}
