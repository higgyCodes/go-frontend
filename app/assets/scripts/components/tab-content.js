'use strict';

import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '../config';

import ErrorPanel from './error-panel';

function TabContent ({ isError, errorMessage, title, children }) {
  return (
    <div>
      {
        isError ? (
          <ErrorPanel title={title} errorMessage={errorMessage} />
        ) : (
          children
        )
      }
    </div >
  );
}

TabContent.defaultProps = {
  isError: false,
  errorMessage: 'coming soon',
  title: 'Error'
};

if (environment !== 'production') {
  TabContent.propTypes = {
    isError: T.bool,
    errorMessage: T.string,
    children: T.node,
    title: T.string
  };
}

export default TabContent;