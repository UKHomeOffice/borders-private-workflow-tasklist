import Immutable from 'immutable';
import reducer, { initialState } from './reducer';
import * as actions from './actions';


describe('Tasks reducer', () => {
  it('fetches tasks assigned to you', () => {
    const expected = reducer(initialState, actions.fetchTasksAssignedToYou('sort=due,desc', 'ABC', false));
    expect(expected.get('isFetchingTasks'))
      .toEqual(true);
    expect(expected.get('filterValue'))
      .toEqual('ABC');
    expect(expected.get('sortValue'))
      .toEqual('sort=due,desc');
  });
  it('successfully fetches tasks', () => {
    const expected = reducer(initialState, actions.fetchTasksAssignedToYouSuccess({
      entity: {
        page: {
          totalElements: 1,
          size: 1,
        },
        _links: {
          next: {
            href: 'next',
          },
          previous: {
            href: 'previous',
          },
        },
        _embedded: {
          tasks: [
            {
              id: 'id',
              name: 'name',
            },
          ],
        },
      },
    }));
    expect(expected.get('isFetchingTasks'))
        .toEqual(false);
    expect(expected.get('total'))
        .toEqual(1);
    expect(expected.get('tasks').size)
        .toEqual(1);
    expect(expected.get('filterValue'))
        .toBeNull();
    expect(expected.get('sortValue'))
        .toEqual('sort=due,desc');
  });
  it('returns isFetchingTasks false if failed', () => {
    const expected = reducer(initialState, actions.fetchTasksAssignedToYouFailure());
    expect(expected.get('isFetchingTasks'))
        .toEqual(false);
  });
  it('updates your group tasks on unclaim success', () => {
    const state = Immutable.Map({
      isFetchingTasks: false,
      tasks: Immutable.fromJS([
        {
          task: {
            id: 'taskIdX',
            assignee: 'someoneB',
          },
        },
        {
          task: {
            id: 'taskId',
            assignee: 'someoneA',
          },
        },
        {
          task: {
            id: 'taskId2',
            assignee: 'someone',
          },
        },
      ]),
      total: 0,
      sortValue: 'sort=due,desc',
      filterValue: null,
    });

    const expected = reducer(state, actions.handleUnclaim('taskId'));

    expect(expected.get('tasks').get(0).getIn(['task', 'assignee'])).toEqual('someoneB');
    expect(expected.get('tasks').get(1).getIn(['task', 'assignee'])).toBeNull();
    expect(expected.get('tasks').get(2).getIn(['task', 'assignee'])).toEqual('someone');
  });
  it('can handle no links', () => {
    const result = reducer(initialState, actions.fetchTasksAssignedToYouSuccess({
      entity : {
        _embedded: {
          tasks: []
        },
        _links: {

        },
        page: {
          totalElements: 30,
          size: 10
        }
      }
    }));
    expect(result.get('firstPageUrl')).toBe(undefined);
    expect(result.get('prevPageUrl')).toBe(undefined);
    expect(result.get('nextPageUrl')).toBe(undefined);
    expect(result.get('lastPageUrl')).toBe(undefined);

  });
  it('can handle  links', () => {
    const result = reducer(initialState, actions.fetchTasksAssignedToYouSuccess({
      entity : {
        _embedded: {
          tasks: []
        },
        _links: {
          prev: {
            href: 'prev'
          },
          first: {
            href: 'first'
          },
          next: {
            href: 'next'
          },
          last: {
            href: 'last'
          }
        },
        page: {
          totalElements: 30,
          size: 10
        }
      }
    }));
    expect(result.get('firstPageUrl')).toBe('first');
    expect(result.get('prevPageUrl')).toBe('prev');
    expect(result.get('nextPageUrl')).toBe('next');
    expect(result.get('lastPageUrl')).toBe('last');

  });

});
