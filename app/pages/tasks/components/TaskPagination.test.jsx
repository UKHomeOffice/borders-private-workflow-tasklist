import React from 'react';
import TaskPagination from "./TaskPagination";

describe('TaskPagination', () => {

    it ('renders without crashing', () => {
        const wrapper = shallow(<TaskPagination />);
        expect(wrapper.find('button').length).toBe(4)
    });

    it ('renders buttons with disabled if actions not provided', () => {
        const wrapper = shallow(<TaskPagination />);
        expect(wrapper.find('.govuk-button--disabled').length).toBe(4)
    });

    it('renders buttons enabled if actions provided', () => {
        const wrapper = shallow(<TaskPagination paginationActions={{
            onPrev: () => {},
            onFirst: () => {},
            onNext: () => {},
            onLast: () => {}
        }}
        />);
        expect(wrapper.find('.govuk-button--disabled').length).toBe(0)
    })

});
