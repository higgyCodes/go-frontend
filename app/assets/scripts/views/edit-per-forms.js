'use strict';

import React from 'react';
import A1PolicyStrategyForm from '../components/per-forms/a1-policy-strategy-form';
import A2AnalysisAndPlanningForm from '../components/per-forms/a2-analysis-and-planning-form';
import A3OperationalCapacity from '../components/per-forms/a3-operational-capacity';
import A4Coordination from '../components/per-forms/a4-coordination';
import A5OperationsSupport from '../components/per-forms/a5-operations-support';
import A3OperationalCapacity2 from '../components/per-forms/a3-operational-capacity-2';
import { Helmet } from 'react-helmet';
import { environment } from '../config';
import { PropTypes as T } from 'prop-types';
import App from './app';

class EditPerForms extends React.Component {
  render () {
    let form = null;
    if (this.props.match.params.formCode === 'a1') {
      form = (<A1PolicyStrategyForm mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a2') {
      form = (<A2AnalysisAndPlanningForm mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a3') {
      form = (<A3OperationalCapacity mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a3-2') {
      form = (<A3OperationalCapacity2 mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a4') {
      form = (<A4Coordination mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    } else if (this.props.match.params.formCode === 'a5') {
      form = (<A5OperationsSupport mode='edit'
        autosaveOn={true}
        match={this.props.match}
        formCode={this.props.match.params.formCode}
        user={this.props.match.params.user}
        ns={this.props.match.params.ns} />);
    }

    return (
      <App className='page--emergencies'>
        <Helmet>
          <title>IFRC Go - Emergencies</title>
        </Helmet>
        <section className='inpage'>
          <div className='inpage__body'>
            <div className='inner'>
              {form}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

if (environment !== 'production') {
  EditPerForms.propTypes = {
    user: T.object,
    profile: T.object,
    fieldReport: T.object,
    location: T.object,
    match: T.object,
    _getProfile: T.func,
    _updateSubscriptions: T.func,
    _getFieldReportsByUser: T.func,
    _updateProfile: T.func
  };
}

export default EditPerForms;
