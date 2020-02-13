import reducer, { initialState } from './reducer';
import Immutable from 'immutable';
const {Map} = Immutable;
import * as actions from './actions';

describe('Case reducer', () => {
   it ('can handle find cases by key', () => {
       const result = reducer(initialState, actions.findCasesByKey('BF-'));
       expect(result.get('searching')).toEqual(true);
   });
   it('can handle success when find cases by key returns result', () => {
       const payload = {
           '_embedded' : {
               cases: [{
                   businessKey: 'test'
               }]
           },
           '_links' : {
               'self' : {
                   href: 'test'
               }
           },
           'page' : {
               'totalElements': 1
           }
       };
       const result = reducer(initialState, actions.findCasesByKeySuccess(payload));
       expect(result.get('searching')).toEqual(false);
       expect(result.get('caseSearchResults')).not.toBeNull()
   });


   it ('can handle successful load next results', () => {
       const payload = {
           'entity' : {
               '_embedded' : {
                   cases: [{
                       businessKey: 'testA'
                   }]
               },
               '_links' : {
                   'self' : {
                       href: 'test'
                   },
                   'next': {
                       href: 'nextA'
                   }
               },
               'page' : {
                   'totalElements': 10
               }
           }

       };

       const result = reducer(new Map({
           loadingNextSearchResults: true,
           caseSearchResults: {
               '_embedded' : {
                   cases: [{
                       businessKey: 'test'
                   }]
               },
               '_links' : {
                   'self' : {
                       href: 'test'
                   },
                   'next': {
                       href: 'next'
                   }
               },
               'page' : {
                   'totalElements': 10
               }
           }
       }), actions.loadNextSearchResultsSuccess(payload));

       expect(result.get('loadingNextSearchResults')).toEqual(false);
       expect(result.get('caseSearchResults')).not.toBeNull();

       expect(result.get('caseSearchResults')._links.next.href).toEqual('nextA');
       expect(result.get('caseSearchResults')._embedded.cases.length).toEqual(2);

   })
});
