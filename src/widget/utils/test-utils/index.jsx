/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react';
import { render as rtlRender, waitFor, act } from '@testing-library/react';
import mockLoadScript from '../load-script/load-script';
import { useMetrics as mockUseMetrics } from '../../contexts/metrics';
import { useConfig as mockConfig } from '../../contexts/config';

export const render = ui => ({ ...rtlRender(ui) });

jest.mock('../../contexts/i18n', () => ({
  useTranslation: () => ({ lang: 'en', t: str => str })
}));
jest.mock('../../contexts/i18n/trans', () => ({ i18nKey }) => (
  <div data-testid={`trans-${i18nKey}`}>{i18nKey}</div>
));

jest.mock('../../utils/load-script/load-script');
mockLoadScript.mockImplementation((_name, cb) => cb());

jest.mock('../../contexts/metrics');
mockUseMetrics.mockImplementation(() => ({ fetchMetric: () => null }));

jest.mock('../../contexts/config');
mockConfig.mockImplementation(() => ({ tabs: [] }));

afterEach(() => {
  jest.clearAllMocks();
});

export { waitFor, act, mockLoadScript, mockUseMetrics, mockConfig };
