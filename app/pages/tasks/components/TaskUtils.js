import _ from 'lodash';
import moment from 'moment';
import AppConstants from '../../../common/AppConstants';
import priority from '../../../core/util/priority';

export default class TaskUtils {
  static buildPaginationAction(props) {
    const pagination = {};
    const { nextPageUrl, prevPageUrl, firstPageUrl, lastPageUrl, load } = props;
    if (firstPageUrl) {
      pagination.onFirst = () => {
        load(
          `${firstPageUrl}&${props.sortValue}${
            props.filterValue ? `&name=${props.filterValue}` : ''
          }`,
        );
      };
    }
    if (prevPageUrl) {
      pagination.onPrev = () => {
        load(
          `${prevPageUrl}&${props.sortValue}${
            props.filterValue ? `&name=${props.filterValue}` : ''
          }`,
        );
      };
    }
    if (nextPageUrl) {
      pagination.onNext = () => {
        load(
          `${nextPageUrl}&${props.sortValue}${
            props.filterValue ? `&name=${props.filterValue}` : ''
          }`,
        );
      };
    }
    if (lastPageUrl) {
      pagination.onLast = () => {
        load(
          `${lastPageUrl}&${props.sortValue}${
            props.filterValue ? `&name=${props.filterValue}` : ''
          }`,
        );
      };
    }
    return pagination;
  }

  static applyGrouping(groupBy, tasks) {
    const byReference = _.groupBy(tasks, data => {
      return data.businessKey;
    });

    const byPriority = _.groupBy(tasks, key => {
      return priority(Number(` ${key.task.priority}`)).trim();
    });

    const byAssignee = _.groupBy(tasks, data => {
      return data['task'].assignee;
    });

    const sortByKeys = object => {
      const sort = _.orderBy(
        Object.keys(object),
        [key => key.toLowerCase()],
        ['asc'],
      );
      return _.fromPairs(_.map(sort, key => [key, object[key]]));
    };
    const sortByPriority = [
      AppConstants.HIGH_PRIORITY_LABEL,
      AppConstants.MEDIUM_PRIORITY_LABEL,
      AppConstants.LOW_PRIORITY_LABEL,
    ];
    const sortKeys = _.orderBy(
      Object.keys(byReference),
      o => {
        return moment(o.split('-')[1]).format('YYYYMMDD');
      },
      ['desc'],
    );

    switch (groupBy) {
      case 'reference':
        return _.fromPairs(_.map(sortKeys, key => [key, byReference[key]]));

      case 'priority':
        return _.fromPairs(
          _.map(sortByPriority, key => {
            const groupedTasks = byPriority[key]
              ? [key, byPriority[key]]
              : [key, 0];
            return groupedTasks;
          }),
        );

      case 'assignee':
        return sortByKeys(byAssignee);

      default:
        return sortByKeys(
          _.groupBy(tasks, data => {
            return data['process-definition']
              ? data['process-definition'].category
              : 'Other';
          }),
        );
    }
  }

  static generateCaption(grouping, val) {
    let caption;
    switch (grouping) {
      case 'category':
      case 'priority':
      case 'assignee':
        caption = val.businessKey;
        break;
      case 'reference':
        caption = val['process-definition'].category;
        break;
      default:
        caption = '';
    }
    return caption;
  }
}
