import { waitFor } from '@testing-library/dom';
import loadExternalScript from './load-external-script';

test('logs an error if the id does not exist', () => {
  console.error = jest.fn();
  loadExternalScript('doesnotexist');
  expect(console.error).toHaveBeenCalledTimes(1);
});

test('inserts a new script tag into the DOM', () => {
  loadExternalScript('__test', () => null);
  expect(document.getElementById('__test')).toBeInTheDocument();
});

test('callback is returned when a new script is inserted', () => {
  const cb = jest.fn();
  loadExternalScript('__test', cb);
  waitFor(() => expect(cb).toHaveBeenCalledTimes(1));
});

test('duplicate script is not re-added if called twice', () => {
  loadExternalScript('__test', () => null);
  loadExternalScript('__test', () => null);
  expect(document.querySelectorAll('[id=__test]').length).toBe(1);
});

test('logs an error if no callback is provided', () => {
  console.error = jest.fn();
  loadExternalScript('__test');
  expect(console.error).toHaveBeenCalledTimes(1);
});
