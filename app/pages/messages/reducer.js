import Immutable from 'immutable';
import * as actions from './actionTypes';

const { Map, List, Set } = Immutable;

export const initialState = new Map({
  isFetching: false,
  notifications: List([]),
  total: 0,
  nextPage: null,
  hasMoreItems: false,
  pageSize: null,
  acknowledgingTaskIds: Set([]),
});

function reducer(state = initialState, action) {
  let acknowledgingTaskIds;
  let data;
  let hasMoreItems;
  let ids;
  let links;
  let merged;
  let moreItems;
  let nextLinks;
  let nextPage;
  let notifications;
  let pagedNotifications;
  let pageNext;
  let pageSize;
  let taskId;
  let taskIds;
  let total;
  let totalResult;

  switch (action.type) {
    case actions.CLEAR_NOTIFICATIONS:
      return initialState;
    // fetch notifications
    case actions.FETCH_NOTIFICATIONS:
      return state.set('isFetching', true);
    case actions.FETCH_NOTIFICATIONS_SUCCESS:
      data = action.payload.entity._embedded
        ? action.payload.entity._embedded.tasks
        : [];
      total = action.payload.entity.page
        ? action.payload.entity.page.totalElements
        : 0;
      pageSize = action.payload.entity.page
        ? action.payload.entity.page.size
        : 20;
      links = action.payload.entity._links;
      nextPage = null;
      hasMoreItems = false;

      if ('next' in links) {
        nextPage = links.next.href;
        hasMoreItems = true;
      }
      if (data && data.length > 0) {
        data.sort((a, b) => a - b);
      }
      return state
        .set('notifications', Immutable.fromJS(data))
        .set('isFetching', false)
        .set('pageSize', pageSize)
        .set('total', total)
        .set('nextPage', nextPage)
        .set('hasMoreItems', hasMoreItems);

    case actions.FETCH_NOTIFICATIONS_FAILURE:
      return state.set('isFetching', false);

    case actions.FETCH_NOTIFICATIONS_NEXT_PAGE:
      return state.set('isFetching', true);
    case actions.FETCH_NOTIFICATIONS_NEXT_PAGE_SUCCESS:
      nextLinks = action.payload.entity._links;
      pageNext = null;
      moreItems = false;
      pagedNotifications = state.get('notifications');
      merged =
        pagedNotifications.size !== 0
          ? pagedNotifications.concat(
              Immutable.fromJS(
                action.payload.entity._embedded
                  ? action.payload.entity._embedded.tasks
                  : [],
              ),
            )
          : Immutable.fromJS(data);
      if ('next' in nextLinks) {
        pageNext = nextLinks.next.href;
        moreItems = true;
      }
      return state
        .set('notifications', merged)
        .set('isFetching', false)
        .set(
          'pageSize',
          action.payload.entity.page ? action.payload.entity.page.size : 20,
        )
        .set(
          'total',
          action.payload.entity.page
            ? action.payload.entity.page.totalElements
            : 0,
        )
        .set('nextPage', pageNext)
        .set('hasMoreItems', moreItems);

    case actions.FETCH_NOTIFICATIONS_NEXT_PAGE_FAILURE:
      return state.set('isFetching', false);

    case actions.ACKNOWLEDGE_NOTIFICATION:
      acknowledgingTaskIds = state
        .get('acknowledgingTaskIds')
        .add(action.taskId);
      return state.set('acknowledgingTaskIds', acknowledgingTaskIds);
    case actions.ACKNOWLEDGE_NOTIFICATION_SUCCESS:
      taskId = action.payload.entity.id;
      taskIds = state.get('acknowledgingTaskIds').delete(taskId);
      totalResult = state.get('total') === 0 ? 0 : state.get('total') - 1;
      state = state
        .set('acknowledgingTaskIds', taskIds)
        .set('total', totalResult);
      notifications = state
        .get('notifications')
        .filter(x => x.getIn(['task', 'id']) !== taskId);
      return state.set('notifications', notifications);
    case actions.ACKNOWLEDGE_NOTIFICATION_FAILURE:
      ids = state.get('acknowledgingTaskIds').delete(action.taskId);
      return state.set('acknowledgingTaskIds', ids);
    default:
      return state;
  }
}

export default reducer;
