// Code from: https://github.com/vinissimus/next-translate/blob/master/src/Trans.tsx
/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useTranslation } from './i18n';

const tagRe = /<(\w+)>(.*?)<\/\1>|<(\w+)\/>/;
const nlRe = /(?:\r\n|\r|\n)/g;

const getElements = parts => {
  if (!parts.length) return [];

  const [paired, children, unpaired, after] = parts.slice(0, 4);

  return [[paired || unpaired, children || '', after]].concat(
    getElements(parts.slice(4, parts.length))
  );
};

const formatElements = (value, elements) => {
  const parts = value.replace(nlRe, '').split(tagRe);

  if (parts.length === 1) return value;

  const tree = [];

  const before = parts.shift();
  if (before) tree.push(before);

  getElements(parts).forEach(([key, children, after], realIndex) => {
    const element = elements[key] || <></>;

    tree.push(
      React.cloneElement(
        element,
        { key: realIndex },
        children ? formatElements(children, elements) : element.props.children
      )
    );

    if (after) tree.push(after);
  });

  return tree;
};

const Trans = ({ i18nKey, components }) => {
  const { t } = useTranslation();
  const text = t(i18nKey);

  if (!components || components.length === 0) return text;
  return formatElements(text, components);
};

export default Trans;
