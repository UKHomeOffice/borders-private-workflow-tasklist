import _ from "lodash";
import moment from "moment";
import {priority} from "../../../core/util/priority";
import * as actions from "../actions";

export default class TaskUtils {

    buildPaginationAction(props) {
        const pagination = {};
        // eslint-disable-next-line no-shadow
        const {nextPageUrl, prevPageUrl, firstPageUrl, lastPageUrl, load} = props;
        if (firstPageUrl) {
            pagination.onFirst = () => {
                load(firstPageUrl);
            };
        }
        if (prevPageUrl) {
            pagination.onPrev = () => {
                load(prevPageUrl);
            };
        }
        if (nextPageUrl) {
            pagination.onNext = () => {
                load(nextPageUrl);
            };
        }
        if (lastPageUrl) {
            pagination.onLast = () => {
                load(lastPageUrl);
            };
        }
        return actions;
    }

    applyGrouping(groupBy, tasks) {
        switch (groupBy) {
            case 'reference':
                const byReference = _.groupBy(tasks, data => {
                    return data.businessKey;
                });
                const sortKeys = _.orderBy(Object.keys(byReference), o => {
                    return moment(o.split('-')[1]).format('YYYYMMDD');
                }, ['desc']);

                return _.fromPairs(_.map(sortKeys, key => [key, byReference[key]]));
            case 'priority':
                const byPriority = _.groupBy(tasks, data => {
                    return data.task.priority;
                });
                const sortByPriority = _.orderBy(Object.keys(byPriority), key => {
                    return Number(key);
                }, ['desc']);
                return _.fromPairs(_.map(sortByPriority, key => {
                    return [priority(Number(` ${  key}`)).trim(), byPriority[key]]
                }));
            default:
                const sortByKeys = object => {
                    const sort = _.orderBy(Object.keys(object), [key => key.toLowerCase()], ['asc']);
                    return _.fromPairs(_.map(sort, key => [key, object[key]]));
                };
                return sortByKeys(_.groupBy(tasks, data => {
                    return data['process-definition'] ? data['process-definition'].category : 'Other';
                }));
        }
    }

    generateCaption(grouping, val) {
        let caption;
        switch (grouping) {
            case 'category':
            case 'priority':
                caption = val.businessKey;
                break;
            case 'reference':
                caption = val['process-definition'].category;
                break;
            default:
                caption = '';

        }
        return caption;
    };
}
