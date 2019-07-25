'use strict';

import React from 'react';
import Fold from './../fold';
import {
  getPerComponent
} from './../../utils/get-per-components';
import { environment } from './../../config';
import { PropTypes as T } from 'prop-types';

export default class GlobalPreparednessHighlights extends React.Component {
  constructor (props) {
    super(props);
    this.highPerformingComponents = [];
    this.highPerformingComponentsDataBuilt = false;
  }

  buildHighPerformingComponentsData () {
    if (!this.highPerformingComponentsDataBuilt && typeof this.props.data.data.results !== 'undefined') {
      this.highPerformingComponentsDataBuilt = true;
      const components = {};
      const highPerformingComponents = [];

      this.props.data.data.results.forEach(result => {
        const correspondingComponent = getPerComponent(result.code, result.question_id)[0];
        if (typeof components[correspondingComponent.cid] === 'undefined') {
          components[correspondingComponent.cid] = {name: correspondingComponent.name, count: 1};
        } else {
          components[correspondingComponent.cid].count++;
        }
      });

      Object.keys(components).sort((componentKeyA, componentKeyB) => {
        if (components[componentKeyA].count < components[componentKeyB].count) {
          return -1;
        } else if (components[componentKeyA].count > components[componentKeyB].count) {
          return 1;
        }
        return 0;
      }).forEach(sortedComponentKey => {
        highPerformingComponents.push(components[sortedComponentKey]);
      });

      this.highPerformingComponents = highPerformingComponents;
    }
  }

  render () {
    if (typeof this.props.prioritizationData === 'undefined') return null;
    if (typeof this.props.data.data !== 'undefined' && typeof this.props.data.data.count !== 'undefined' && this.props.data.data.count === 0 &&
      typeof this.props.prioritizationData !== 'undefined' && Object.keys(this.props.prioritizationData).length === 0) return null;
    this.buildHighPerformingComponentsData();
    const highPerformingComponents = [];
    this.highPerformingComponents.forEach((component, index) => {
      highPerformingComponents.push(<li key={component.name + 'highperforming' + index}>{component.name}</li>);
    });
    const highPriorityComponents = [];
    if (Object.keys(this.props.prioritizationData).length > 0) {
      Object.keys(this.props.prioritizationData).forEach((key, index) => {
        highPriorityComponents.push(<li key={key + 'highpriority' + index}>{key.replace(/_/g, ' ')}</li>);
      });
    }
    if (highPerformingComponents.length === 0 && highPriorityComponents.length === 0) return null;
    return (
      <div className='inner'>
        <Fold title={'Global Preparedness Highlights'} foldClass='margin-reset'>
          <div style={{width: '50%', float: 'left'}}>
            <span style={{fontWeight: 'bold'}}>High Performing Components (globally)</span>
            <ul>
              {this.props.perPermission ? highPerformingComponents : 'You can only see this data if you have the correct permissions.'}
            </ul>
          </div>
          <div style={{width: '50%', float: 'left'}}>
            <span style={{fontWeight: 'bold'}}>Top Prioritized Components (globally)</span>
            <ul>
              {highPriorityComponents}
            </ul>
          </div>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  GlobalPreparednessHighlights.propTypes = {
    data: T.object,
    prioritizationData: T.object,
    perPermission: T.bool
  };
}
