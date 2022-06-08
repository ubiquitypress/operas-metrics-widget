import React from 'react';
import { mockConfig, render as rtlRender } from '../../utils/test-utils';
import GoogleScholarCitation from './google-scholar-citation';

const render = () => {
  return {
    ...rtlRender(<GoogleScholarCitation />)
  };
};

// rendering
test('does not render if `show_google_scholar_citation_link` is false', () => {
  mockConfig.mockImplementation(() => ({
    settings: { show_google_scholar_citation_link: false }
  }));
  const { queryByTestId } = render();
  expect(queryByTestId('google-scholar-citation')).not.toBeInTheDocument();
});
test('does not render if `work_title` is missing', () => {
  mockConfig.mockImplementation(() => ({
    settings: { show_google_scholar_citation_link: true }
  }));
  const { queryByTestId } = render();
  expect(queryByTestId('google-scholar-citation')).not.toBeInTheDocument();
});
test('renders if `show_google_scholar_citation_link` is true and `work_title` is not missing', () => {
  mockConfig.mockImplementation(() => ({
    settings: {
      show_google_scholar_citation_link: true,
      work_title: 'My work',
      rees: 'lol'
    }
  }));
  const { getByTestId } = render();
  getByTestId('google-scholar-citation');
});
