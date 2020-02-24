import * as types from 'react-device-detect';
import _ from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import ReactHyperResponsiveTable from 'react-hyper-responsive-table';
import moment from 'moment';


import './YourTasks.scss';
import FilterTaskName from './FilterTaskName';
import SortTasks from './SortTasks';
import AppConstants from '../../../common/AppConstants';

const YourTasks = props => {

  document.title = `Tasks assigned to you | ${AppConstants.APP_NAME}`;

  const {
    yourTasks,
    sortYourTasks,
    filterTasksByName,
    goToTask,
  } = props;
  let groupedTasks = [];
  let headers = { name: null, action: null };

  if (yourTasks && yourTasks.get('tasks')) {
    groupedTasks = _.groupBy(yourTasks.get('tasks').toJS(), data => {
      const groupKey = data['process-definition'] ? data['process-definition'].category : 'Other';
      return groupKey;
    });
  }

  const sortByKeys = object => {
    const keys = Object.keys(object);
    const initialSort = _.sortBy(keys);
    const sortedKeys = _.sortBy(initialSort, key => (key === 'Other' ? 1 : 0));
    return _.fromPairs(_.map(sortedKeys, key => [key, object[key]]));
  };
  const sortedData = sortByKeys(groupedTasks);

  if (!types.isMobile) {
    headers = {
      name: null,
      due: null,
      action: null,
    };
  }

  const dataToDisplay = _.map(sortedData, (value, key) => {
    const data = _.map(value, val => {
      const { task } = val;
      const actionButton = <button id="actionButton" className="govuk-button" onClick={() => goToTask(task.id)} type="submit">Action</button>;

      // datetime format
      const utcDateTime = moment.utc(task.due).format();
      const localDateTime = moment(utcDateTime).local().format();
      const dueDateTime = moment().to(localDateTime);

      if (types.isMobile) {
        return { id: task.id, action: actionButton, name: task.name };
      }

      return {
        id: task.id,
        name: <div className="govuk-!-font-size-19">{task.name}</div>,
        due: <div className="govuk-!-font-size-19">{`due ${dueDateTime}`}</div>,
        action: actionButton,
      };
    });

    const tasks = value.length === 1 ? 'task' : 'tasks';

    return (
      <div key={`category::${key}`} className="tasksGrouping">
        <div style={{ paddingBottom: '5px' }} className="data-item govuk-!-font-size-19 govuk-!-font-weight-bold" key={key}>
          {key} {tasks}
        </div>
        <ReactHyperResponsiveTable
          key={`category::${key}`}
          headers={headers}
          rows={data}
          keyGetter={row => row.id}
          breakpoint={578}
          tableStyling={({ narrow }) => (narrow ? 'narrowtable-yourtasks' : 'widetable-yourtasks')}
        />
      </div>
    );
  });

  let totalTasks = yourTasks.get('total');
  totalTasks = totalTasks === 1 ? `${totalTasks} task` : `${totalTasks} tasks`;

  return (
    <div>
      <div style={{ paddingTop: '10px' }}>
        <div className="data" id="yourTasksTotalCount">
          <span className="data-item govuk-!-font-size-24 govuk-!-font-weight-bold">
            {totalTasks} assigned to you
          </span>
        </div>

        <div className="govuk-grid-row" style={{ paddingTop: '10px' }}>
          <div className="govuk-grid-column-one-half">
            <SortTasks tasks={yourTasks} sortTasks={sortYourTasks} />
          </div>
          <div className="govuk-grid-column-one-half">
            <FilterTaskName tasks={yourTasks} filterTasksByName={filterTasksByName} />
          </div>
        </div>
        {dataToDisplay}
      </div>
    </div>
  );
};

YourTasks.propTypes = {
  filterTasksByName: PropTypes.func.isRequired,
  goToTask: PropTypes.func.isRequired,
  sortYourTasks: PropTypes.func.isRequired,
  yourTasks: ImmutablePropTypes.map.isRequired,
};

export default YourTasks;
