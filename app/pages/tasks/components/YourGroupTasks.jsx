import ReactHyperResponsiveTable from 'react-hyper-responsive-table';
import React from 'react';
import moment from 'moment';
import SortTasks from './SortTasks';
import FilterTaskName from './FilterTaskName';
import * as types from 'react-device-detect';
import _ from 'lodash';
import './YourGroupTasks.scss';

const YourGroupTasks = ({ yourGroupTasks,
                          sortYourGroupTasks,
                          filterTasksByName,
                          goToTask,
                          startAProcedure,
                          handleUnclaim,
                          claimTask,
                          userId}) => {

  const groupedTasks = yourGroupTasks && yourGroupTasks.get('tasks') ?_.groupBy(yourGroupTasks.get('tasks').toJS(), (data) => {
    const groupKey = data['process-definition'] ? data['process-definition']['category']
      : 'Other';
    return groupKey;
  }): [];
  const sortByKeys = object => {
    const keys = Object.keys(object);
    const initialSort = _.sortBy(keys);
    const sortedKeys = _.sortBy(initialSort, (key) =>  {
      return key === 'Other'? 1: 0;
    });
    return _.fromPairs(
      _.map(sortedKeys, key => [key, object[key]])
    )
  };
  const sortedData = sortByKeys(groupedTasks);

  const headers = types.isMobile ? {
    name: null,
    action: null
  } : {
    name: null,
    due: null,
    assignee: null,
    action: null
  };

  const dataToDisplay = _.map(sortedData, (value, key) => {
    const data = _.map(value, (val) => {
      const task = val.task;
      const claimButton  =  <button id="actionButton" className="govuk-button" onClick={() => claimTask(task.id)} type="submit">Claim</button>;
      const unclaimButton = <button id="actionButton" className="govuk-button" onClick={() => {
        handleUnclaim(task.id)
      }} type="submit" >Unclaim</button>;

      const name = task.name;
      const taskId = task.id;

      const assignee = task.assignee === null ? <div className="govuk-!-font-size-19">{'Unassigned'}</div> : (task.assignee === userId ? <div className="govuk-!-font-size-19">{'Assigned to you'}</div> : <div className="govuk-!-font-size-19">{task.assignee}</div>)

      const toView= <a href="#" style={{textDecoration: 'underline'}} className="govuk-link govuk-!-font-size-19" onClick={() => goToTask(taskId)}>{name}</a>;

      return types.isMobile ? {
        id: taskId,
        name: toView,
        action: task.assignee === null || task.assignee !== userId ? claimButton : unclaimButton
      } : {
        id: taskId,
        name: toView,
        due: <div className="govuk-!-font-size-19">{"due " + moment().to(moment(task.due))}</div>,
        assignee: assignee,
        action: task.assignee === null || task.assignee !== userId ? claimButton : unclaimButton
      }
    });
    return <div key={`category::${key}`} className="tasksGrouping">
      <div style={{paddingBottom: '5px'}} className="data-item govuk-!-font-size-19 govuk-!-font-weight-bold" key={key}>{key} ({value.length} {value.length === 1 ? 'task' : 'tasks'})</div>
      <ReactHyperResponsiveTable
        key={`category::${key}`}
        headers={headers}
        rows={data}
        keyGetter={row => row.id}
        breakpoint={578}
        tableStyling={({ narrow }) => (narrow ? 'narrowtable-yourgrouptasks' : 'widetable-yourgrouptasks')}
      />
    </div>
  });
  return <div>
    <a href="#" className="govuk-link govuk-!-font-size-19" style={{textDecoration:'underline'}} onClick={startAProcedure}>Submit a form</a>
    <div style={{ paddingTop: '10px' }}>
      <div className="data" id="yourGroupTasksTotalCount">
          <span
            className="data-item govuk-!-font-size-24 govuk-!-font-weight-bold">{yourGroupTasks.get('total')} {yourGroupTasks.get('total') === 1 ? 'task' : 'tasks'} allocated to your team</span>
      </div>
      <div className="govuk-grid-row" style={{paddingTop: '10px'}}>
        <div className="govuk-grid-column-one-half">
          <SortTasks tasks={yourGroupTasks} sortTasks={sortYourGroupTasks}/>
        </div>

        <div className="govuk-grid-column-one-half">
          <FilterTaskName tasks={yourGroupTasks} filterTasksByName={filterTasksByName}/>
        </div>
      </div>
      {dataToDisplay}

    </div>
  </div>;
};

export default YourGroupTasks;
