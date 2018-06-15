'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { nope, percent, commaSeparatedNumber as n } from '../../utils/format';
import { get } from '../../utils/utils';
import { environment } from '../../config';
import { getFeaturedEmergencies } from '../../actions';
import BlockLoading from '../block-loading';
import Fold from '../fold';

const title = 'Active Emergencies';

class FeaturedEmergencies extends React.Component {
  componentWillMount () {
    this.props._getFeaturedEmergencies();
  }

  /* eslint-disable camelcase */
  renderCard (d) {
    const { disaster_start_date, id, name } = d;
    const appeals = get(d, 'appeals', []);
    const beneficiaries = appeals.reduce((acc, curr) => acc + curr.num_beneficiaries, 0);
    const requested = appeals.reduce((acc, curr) => acc + curr.amount_requested, 0);
    const funded = appeals.reduce((acc, curr) => acc + curr.amount_funded, 0);
    return (
      <li className='key-emergencies-item' key={id}>
        <Link to={`/emergencies/${id}`}>
          <h2 className='card__title'>{name}</h2>
          <p className='card__date'>Start Date: {disaster_start_date ? DateTime.fromISO(disaster_start_date).toISODate() : nope}</p>
          {appeals.length ? (
            <ul className='card__stat-list'>
              <li className='card__stat stats-people'>{n(beneficiaries)}<small>Targeted Beneficiaries</small></li>
              <li className='card__stat stats-funding'>{requested ? percent(funded, requested) + '%' : nope}<small>Funded</small></li>
            </ul>
          ) : null}
        </Link>
      </li>
    );
  }
  /* eslint-enable camelcase */

  render () {
    const { error, fetching, fetched, data } = this.props.featured;
    if (fetched && (error || !Array.isArray(data.results) || !data.results.length)) return null;
    else if (!fetched || fetching) return <div className='inner'><Fold title={title}><BlockLoading/></Fold></div>;
    return (
      <div className='inner'>
        <Fold title={title}>
          <ul className='key-emergencies-list'>
            {data.results.map(this.renderCard)}
          </ul>
          <Link to='/emergencies' className='link--primary'>View All Emergencies</Link>
        </Fold>
      </div>
    );
  }
}

if (environment !== 'production') {
  FeaturedEmergencies.propTypes = {
    _getFeaturedEmergencies: T.func,
    featured: T.object
  };
}

const selector = (state) => ({
  featured: state.emergencies.featured
});

const dispatcher = (dispatch) => ({
  _getFeaturedEmergencies: (...args) => dispatch(getFeaturedEmergencies(...args))
});

export default connect(selector, dispatcher)(FeaturedEmergencies);
