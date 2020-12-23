import React, { Component, Fragment } from 'react';
import { service, factories, models } from 'powerbi-client';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import secureLocalStorage from '../../../common/security/SecureLocalStorage';
import LogoBar from '../../../core/components/LogoBar';

export class PowerBIReport extends Component {
  constructor(props) {
    super(props);
    const { useMobileLayout } = this.props;
    this.reportContainer = React.createRef();
    this.setFullscreen = this.setFullscreen.bind(this);
    this.onPageChange = this.onPageChange.bind(this);
    this.useMobileLayout = useMobileLayout;
    this.visitedPages = [];
  }

  componentDidMount() {
    const { apiRefUrl, accessToken, embedUrl, id, kc } = this.props;

    const powerBIBranchNames = [
      'Central',
      'Detection Services',
      'Heathrow',
      'Intelligence',
      'National Operations',
      'North',
      'South',
      'South East and Europe',
    ];

    const {
      team: { branchid: branchId } = {},
    } = secureLocalStorage.get(`shift::${kc.tokenParsed.email}`);

    axios({
      method: 'get',
      url: `${apiRefUrl}/v2/entities/branch?filter=id=eq.${branchId}`,
      headers: { Authorization: `Bearer ${kc.token}` },
    })
      .then(({ data }) => {
        const branchName = data.data.length && data.data[0].name;
        if (powerBIBranchNames.includes(branchName)) {
          this.userBranchName = branchName;
        }
        const embedConfig = {
          accessToken,
          type: 'report',
          embedUrl,
          id,
          permissions: models.Permissions.Read,
          settings: {
            filterPaneEnabled: false,
            layoutType: this.useMobileLayout
              ? models.LayoutType.MobilePortrait
              : models.LayoutType.Master,
          },
          tokenType: models.TokenType.Embed,
        };

        const powerbi = new service.Service(
          factories.hpmFactory,
          factories.wpmpFactory,
          factories.routerFactory,
        );
        const target = this.reportContainer.current;
        this.report = target && powerbi.embed(target, embedConfig);

        if (this.userBranchName) {
          this.report && this.report.on('pageChanged', this.onPageChange);
        }
      })
      .catch(error => {
        console.log(`Error: ${error}`);
      });
  }

  onPageChange(e) {
    const {
      newPage,
      newPage: { displayName },
    } = e.detail;

    if (this.visitedPages.includes(displayName)) return;

    let visualNumber;
    let target;
    this.visitedPages.push(displayName);
    const { userBranchName } = this;
    if (displayName === 'Command Brief - OAR') {
      visualNumber = 5;
      target = { table: 'OAR', column: 'Branch Name' };
    } else if (displayName === 'Command Brief - IEN') {
      visualNumber = 4;
      target = { table: 'IEN', column: 'Branch' };
    } else {
      return;
    }
    newPage.getVisuals().then(visuals => {
      const targetVisual = visuals[visualNumber];
      targetVisual
        .setSlicerState({
          filters: [
            {
              $schema: 'http://powerbi.com/product/schema#basic',
              target,
              operator: 'In',
              values: [userBranchName],
            },
          ],
        })
        .catch(errors => {
          console.log(`Power BI could not get visuals. Errors: ${errors}`);
        });
    });
  }

  setFullscreen() {
    if (this.report) this.report.fullscreen();
  }

  render() {
    const logoBar = this.useMobileLayout ? null : (
      <LogoBar setFullscreen={this.setFullscreen} />
    );

    return (
      <Fragment>
        <div
          id="report"
          style={{ width: '100%', height: '100%' }}
          ref={this.reportContainer}
        />
        {logoBar}
      </Fragment>
    );
  }
}

PowerBIReport.propTypes = {
  accessToken: PropTypes.string.isRequired,
  apiRefUrl: PropTypes.string.isRequired,
  embedUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  kc: PropTypes.shape({
    token: PropTypes.string.isRequired,
    tokenParsed: PropTypes.shape({
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  useMobileLayout: PropTypes.bool.isRequired,
};

export default connect(state => {
  return {
    kc: state.keycloak,
    apiRefUrl: state.appConfig.apiRefUrl,
  };
})(PowerBIReport);
