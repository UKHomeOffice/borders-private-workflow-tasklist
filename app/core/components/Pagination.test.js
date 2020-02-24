import React from 'react';
import Immutable from 'immutable';
import Pagination from './Pagination';

describe('Pagination', () => {
  const buildItems = number => {
    const items = [];
    for (let i = 0; i < number; i += 1) {
      items[i] = {
        id: `itemId${i}`,
        name: `itemName${i}`,
      };
    }
    return Immutable.fromJS(items);
  };

  it('renders pagination', async () => {
    const items = buildItems(50);
    const onChangePage = jest.fn();
    const wrapper = await mount(<Pagination items={items} onChangePage={onChangePage} />);
    expect(wrapper).toMatchSnapshot();
  });
});
