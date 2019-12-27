import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PropTypes from 'prop-types';

import AppConstants from '../../../common/AppConstants';
import DataSpinner from '../../../core/components/DataSpinner';

export default function withAuthCheck(WrappedComponent) {
  return class AuthCheck extends React.Component {
    static propTypes = {
      fetchExtendedStaffDetails: PropTypes.func.isRequired,
      extendedStaffDetails: ImmutablePropTypes.list,
      history: PropTypes.object.isRequired,
      kc: PropTypes.shape({
        tokenParsed: PropTypes.shape({ email: PropTypes.string }),
      }).isRequired,
      match: PropTypes.shape({
        params: PropTypes.shape({ staffId: PropTypes.string.isRequired }),
      }).isRequired,
    };

    static defaultProps = {
      extendedStaffDetails: null,
    };

    constructor(props) {
      super(props);
      this.state = { isAuthorised: false };
    }

    componentDidMount() {
      const {
        fetchExtendedStaffDetails,
        match: {
          params: { staffId },
        },
      } = this.props;
      fetchExtendedStaffDetails(staffId);
    }

    componentDidUpdate() {
      const {
        extendedStaffDetails,
        kc: {
          tokenParsed: { email },
        },
        history,
      } = this.props;
      if (extendedStaffDetails) {
        const { isAuthorised } = this.state;
        const {
          linemanager_delegate_email: lineManagerDelegateEmail,
          linemanager_email: lineManagerEmail,
        } = extendedStaffDetails.toJS()[0];
        if (
          lineManagerEmail === email
          || (lineManagerDelegateEmail && lineManagerDelegateEmail.includes(email))
        ) {
          if (isAuthorised !== true) {
            this.setState({ isAuthorised: true });
          }
        } else {
          history.replace(AppConstants.DASHBOARD_PATH);
        }
      }
    }

    render() {
      const { isAuthorised } = this.state;
      return isAuthorised ? (
        <WrappedComponent {...this.props} />
      ) : (
        <DataSpinner message="Checking permissions..." />
      );
    }
  };
}
