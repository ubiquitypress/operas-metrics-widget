import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import KeyValueTable from './key-value-table';

const render = data => {
  return { ...rtlRender(<KeyValueTable data={data} />) };
};

test('renders each item provided', () => {
  const data = [
    { key: 'January', value: '31' },
    { key: 'February', value: '28' },
    { key: 'March', value: '31' },
    { key: 'April', value: '30' },
    { key: 'May', value: '31' },
    { key: 'June', value: '30' },
    { key: 'July', value: '31' },
    { key: 'August', value: '31' },
    { key: 'September', value: '30' },
    { key: 'October', value: '31' },
    { key: 'November', value: '30' },
    { key: 'December', value: '31' }
  ];
  const { getByText, getAllByText } = render(data);

  data.forEach(item => {
    getByText(item.key);
    if (item.value === '28') expect(getAllByText(item.value).length).toBe(1);
    if (item.value === '30') expect(getAllByText(item.value).length).toBe(4);
    if (item.value === '31') expect(getAllByText(item.value).length).toBe(7);
  });
});
