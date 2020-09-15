import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './button';

const render = ({ type, onClick, children = <></> } = {}) => {
  return {
    ...rtlRender(
      <Button type={type} onClick={onClick}>
        {children}
      </Button>
    )
  };
};

test('renders a button component', () => {
  const { getByRole } = render();
  getByRole('button');
});

test('button type is correct if provided', () => {
  const { getByRole } = render({ type: 'submit' });
  const btn = getByRole('button');
  expect(btn).toHaveAttribute('type', 'submit');
});

test('button type is `button` if not provided', () => {
  const { getByRole } = render();
  const btn = getByRole('button');
  expect(btn).toHaveAttribute('type', 'button');
});

test('onClick callback works', () => {
  const onClick = jest.fn();
  const { getByRole } = render({ onClick });
  const btn = getByRole('button');

  expect(onClick).toHaveBeenCalledTimes(0);
  userEvent.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('renders children', () => {
  const msg = 'Hello world!';
  const { getByText } = render({ children: <p>{msg}</p> });
  getByText(msg);
});
