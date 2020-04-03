import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PubSub from 'pubsub-js';
import { isFetchingMessageCounts, messageCounts } from '../selectors';
import * as actions from '../actions';
import AppConstants from '../../../common/AppConstants';
import withLog from '../../../core/error/component/withLog';

export class MessagesPanel extends React.Component {

    constructor(props) {
        super(props);
        this.messages = this.messages.bind(this);

    }

    componentDidMount() {
        if (this.props.hasActiveShift) {
            this.token = PubSub.subscribe('refreshCount', (msg, data) => {
              const path = this.props.history.location.pathname;
              const user = this.props.kc.tokenParsed.email;
              this.props.log([{
                level: 'info',
                user,
                path,
                message: 'refreshing message count',
              }]);
              this.props.fetchMessageCounts();
            });
            this.props.fetchMessageCounts();
        } else {
            this.props.setDefaultCounts();
        }

    }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!this.props.isFetchingMessageCounts) {
      const path = this.props.history.location.pathname;
      const user = this.props.kc.tokenParsed.email;

      const logStatements = [{
        level: 'info',
        user,
        path,
        message: 'message count loaded',
        messageCount: this.props.messageCounts
      }];
      this.props.log(logStatements);
    }
  }

    componentWillUnmount() {
        if (this.token) {
            PubSub.unsubscribe(this.token);
        }
    }

    messages(e) {
        e.preventDefault();
        this.props.history.replace({
            pathname: AppConstants.MESSAGES_PATH,
            shiftPresent: this.props.hasActiveShift
        });
    }

    render() {
        const {isFetchingMessageCounts, messageCounts} = this.props;

        return  (
          <li className="__card govuk-grid-column-one-third" id="messagesPanel">
            <a href={AppConstants.MESSAGES_PATH} onClick={this.messages} className="card__body" id="messagesPageLink">
              {
                    isFetchingMessageCounts ?   (
                      <span
                        className="govuk-!-font-size-19 govuk-!-font-weight-bold"
                      >Loading
                      </span>
): (
  <span
    className="govuk-!-font-size-48 govuk-!-font-weight-bold"
    id="messageCount"
  >{messageCounts}
  </span>
)
                }
              <span className="govuk-!-font-size-19 govuk-!-font-weight-bold">messages</span>
            </a>
            <div className="card__footer">
              <span className="govuk-!-font-size-19">Your messages/notifications</span>
            </div>
          </li>
)

    }
}

MessagesPanel.propTypes = {
  log: PropTypes.func,
  fetchMessageCounts: PropTypes.func.isRequired,
  messageCounts: PropTypes.number,
  isFetchingMessageCounts: PropTypes.bool
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(state => {
  return {
    messageCounts: messageCounts(state),
    isFetchingMessageCounts: isFetchingMessageCounts(state),
    kc: state.keycloak
  }
}, mapDispatchToProps)(withRouter(withLog(MessagesPanel)));
