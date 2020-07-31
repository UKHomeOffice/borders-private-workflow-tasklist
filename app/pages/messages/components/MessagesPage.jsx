import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
import { createStructuredSelector } from 'reselect';
import * as actions from '../actions';
import {
  acknowledgingTaskIds,
  hasMoreItems,
  isFetching,
  nextPage,
  notifications,
  pageSize,
  total,
} from '../selectors';

export class MessagesPage extends React.Component {
  componentDidMount() {
    this.props.fetchNotifications();
  }

  componentWillUnmount() {
    this.props.clearNotifications();
  }

  render() {
    const items = [];
    this.props.notifications.forEach(task => {
      const notificationElement = items.find(
        element => element.key === task.getIn(['task', 'id']),
      );
      if (!notificationElement) {
        items.push(
          <NotificationTask
            key={task.getIn(['task', 'id'])}
            task={task}
            action={this.props}
          />,
        );
      }
    });

    return (
      <div>
        {this.props.isFetching ? (
          <h4 className="govuk-heading-s" id="loadingMessages">
            Loading messages...
          </h4>
        ) : (
          <div className="govuk-grid-row" id="numberOfMessages">
            <div className="govuk-grid-column-one-half">
              <span className="govuk-caption-l">Operational messages</span>
              <h2 className="govuk-heading-l">
                {this.props.total} messages
              </h2>
            </div>
          </div>
        )}
        <InfiniteScroll
          pageStart={0}
          loadMore={() =>
            this.props.fetchNotificationsNextPage(this.props.nextPage)}
          initialLoad={false}
          hasMore={this.props.hasMoreItems}
        >
          <div
            className="govuk-card__flex-container govuk-grid-row"
            id="messages"
          >
            {items}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

const NotificationTask = ({ task, action }) => {
  const taskId = task.getIn(['task', 'id']);
  const taskDescription = task.getIn(['task', 'description']);
  const taskName = task.getIn(['task', 'name']);
  const taskPriority = task.getIn(['task', 'priority']);

  const determineTitle = task => {
    const taskPriority = task.getIn(['task', 'priority']);
    switch (taskPriority) {
      case 1000:
        return 'Emergency';
      case 100:
        return 'Urgent';
      default:
        return 'Standard';
    }
  };

  const created = task => {
    const created = moment(task.getIn(['task', 'created']));
    return created.fromNow(false);
  };

  const onClick = e => {
    e.preventDefault();
    action.acknowledgeNotification(taskId);
  };
  return (
    <div className="govuk-card__flex-item govuk-grid-column-one-third">
      <div className="govuk-card">
        <span className="govuk-caption-m" id="messageCreated">
          {created(task)}
        </span>
        <h3 className="govuk-heading-m" id="messageName">
          {taskPriority >= 100 && taskPriority <= 1000 ? (
            <div className="govuk-warning-text ">
              <span
                className="govuk-warning-text__icon"
                aria-hidden="true"
                style={{ width: '40px', height: '40px' }}
              >
                !
              </span>
              <strong className="govuk-warning-text__text">
                <span className="govuk-warning-text__assistive">Warning</span>
                {determineTitle(task)}: {taskName}
              </strong>
            </div>
          ) : (
            <div>
              {determineTitle(task)}: {taskName}
            </div>
          )}
        </h3>
        <div className="govuk-card__content">
          <p className="govuk-body"> {taskDescription}</p>
        </div>
        <div className="govuk-card__actions">
          <button
            className="govuk-button"
            type="submit"
            onClick={onClick}
            disabled={action.acknowledgingTaskIds.contains(taskId)}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

MessagesPage.propTypes = {
  fetchNotifications: PropTypes.func.isRequired,
  fetchNotificationsNextPage: PropTypes.func.isRequired,
  acknowledgeNotification: PropTypes.func.isRequired,
  clearNotifications: PropTypes.func.isRequired,
  notifications: ImmutablePropTypes.list.isRequired,
  isFetching: PropTypes.bool,
  total: PropTypes.number,
  nextPage: PropTypes.string,
  hasMoreItems: PropTypes.bool,
  pageSize: PropTypes.number,
};

const mapStateToProps = createStructuredSelector({
  notifications,
  isFetching,
  total,
  nextPage,
  hasMoreItems,
  pageSize,
  acknowledgingTaskIds,
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage);
