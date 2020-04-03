import Immutable from 'immutable';
import TaskUtils from "./TaskUtils";


const {Map} = Immutable;

describe('TaskUtils', () => {
    const taskUtils = new TaskUtils();
    const data = [{
        'businessKey': 'DEV-20200210-1223',
        'process-definition': {
            'category': 'B'
        },
        task: {
            name: 'test1',
            priority: 50
        }
    },
        {
            'process-definition': {
                'category': 'a'
            },
            'businessKey': 'DEV-20200220-1223',
            task: {
                name: 'test2',
                priority: 1000
            }
        }];
    it('groups by reference', () => {
        const result = taskUtils.applyGrouping('reference', data);
        const keys = Object.keys(result);
        expect(keys[0]).toEqual('DEV-20200220-1223');
        expect(keys[1]).toEqual('DEV-20200210-1223');

    });

    it('groups by priority', () => {
        const result = taskUtils.applyGrouping('priority', data);
        const keys = Object.keys(result);
        expect(keys[0]).toEqual('High');
        expect(keys[1]).toEqual('Low');

    });

    it('groups by category', () => {

        const result = taskUtils.applyGrouping('category', data);
        const keys = Object.keys(result);
        expect(keys[0]).toEqual('a');
        expect(keys[1]).toEqual('B');
    });
})
