'use strict';
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';

import { environment } from '../../config';
import { getAppeals } from '../../actions';
import { commaSeparatedNumber as n, nope } from '../../utils/format';
import { getDtypeMeta } from '../../utils/get-dtype-meta';
import {
  get,
  dateOptions,
  datesAgo,
  dTypeOptions,
  appealTypeOptions
} from '../../utils/utils/';

import ExportButton from '../export-button';
import Fold from '../fold';
import BlockLoading from '../block-loading';
import DisplayTable, { SortHeader, FilterHeader } from '../display-table';
import { SFPComponent } from '../../utils/extendables';

const appealsType = {
  0: 'DREF',
  1: 'Appeal',
  2: 'Movement'
};

class AppealsTable extends SFPComponent {
  constructor (props) {
    super(props);
    this.state = {
      table: {
        page: 1,
        limit: isNaN(props.limit) ? 10 : props.limit,
        sort: {
          field: '',
          direction: 'asc'
        },
        filters: {
          date: 'all',
          dtype: 'all',
          status: 'all',
          atype: 'all'
        }
      }
    };
  }

  componentDidMount () {
    this.requestResults(this.props);
  }

  componentWillReceiveProps (newProps) {
    let shouldMakeNewRequest = false;
    ['limit', 'country', 'region', 'atype', 'record'].forEach(prop => {
      if (newProps[prop] !== this.props[prop]) {
        shouldMakeNewRequest = true;
      }
    });
    if (shouldMakeNewRequest) {
      this.requestResults(newProps);
    }
  }

  requestResults (props) {
    props._getAppeals(this.state.table.page, this.getQs(props), props.action);
  }

  getQs (props) {
    let state = this.state.table;
    let qs = { limit: state.limit };
    if (state.sort.field) {
      qs.ordering = (state.sort.direction === 'desc' ? '-' : '') + state.sort.field;
    } else {
      qs.ordering = '-start_date';
    }

    if (state.filters.date !== 'all') {
      qs.start_date__gte = datesAgo[state.filters.date]();
    }
    if (state.filters.dtype !== 'all') {
      qs.dtype = state.filters.dtype;
    }
    if (state.filters.status !== 'all') {
      qs.status = state.filters.status;
    }
    if (state.filters.atype !== 'all') {
      qs.atype = state.filters.atype;
    }

    if (props.showActive) {
      qs.end_date__gt = DateTime.utc().toISO();
    }

    if (!isNaN(props.country)) {
      qs.country = props.country;
    } else if (!isNaN(props.region)) {
      qs.region = props.region;
    }

    if (props.atype) {
      qs.atype = props.atype === 'appeal' ? '1'
        : props.atype === 'dref' ? '0' : null;
    }

    if (!isNaN(props.record)) {
      qs.id = props.record;
    }
    return qs;
  }

  updateData (what) {
    this.requestResults(this.props);
  }

  render () {
    const {
      fetched,
      fetching,
      error,
      data
    } = this.props.appeals;

    const title = this.props.title || 'Operations Overview';

    if (fetching) {
      return (
        <Fold title={title} id={this.props.id}>
          <BlockLoading/>
        </Fold>
      );
    }

    if (error) {
      return (
        <Fold title={title} id={this.props.id}>
          <p>Operations data not available.</p>
        </Fold>
      );
    }

    if (fetched) {
      const headings = [
        {
          id: 'date',
          label: <FilterHeader id='date' title='Start Date' options={dateOptions} filter={this.state.table.filters.date} onSelect={this.handleFilterChange.bind(this, 'table', 'date')} />
        },
        {
          id: 'type',
          label: <FilterHeader id='type' title='Type' options={appealTypeOptions} filter={this.state.table.filters.atype} onSelect={this.handleFilterChange.bind(this, 'table', 'atype')} />
        },
        { id: 'code', label: 'Code' },
        {
          id: 'name',
          label: <SortHeader id='name' title='Name' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'name')} />
        },
        { id: 'event', label: 'Emergency' },
        {
          id: 'dtype',
          label: <FilterHeader id='dtype' title='Disaster Type' options={dTypeOptions} filter={this.state.table.filters.dtype} onSelect={this.handleFilterChange.bind(this, 'table', 'dtype')} />
        },
        {
          id: 'requestAmount',
          label: <SortHeader id='amount_requested' title='Requested Amount (CHF)' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'amount_requested')} />
        },
        {
          id: 'fundedAmount',
          label: <SortHeader id='amount_funded' title='Funding (CHF)' sort={this.state.table.sort} onClick={this.handleSortChange.bind(this, 'table', 'amount_funded')} />
        },
        {
          id: 'country',
          label: 'Country'
        }
      ];

      const rows = data.results.map(o => ({
        id: o.id,
        date: DateTime.fromISO(o.start_date).toISODate(),
        code: o.code,
        name: o.name,
        event: o.event ? <Link to={`/emergencies/${o.event}`} className='link--primary' title='View Emergency'>Link</Link> : nope,
        dtype: get(getDtypeMeta(o.dtype), 'label', nope),
        requestAmount: {
          value: n(o.amount_requested),
          className: 'right-align'
        },
        fundedAmount: {
          value: n(o.amount_funded),
          className: 'right-align'
        },
        type: appealsType[o.atype],
        country: o.country ? <Link to={`/countries/${o.country.id}`} className='link--primary' title='View Country'>{o.country.name}</Link> : nope
      }));

      return (
        <Fold title={`${title} (${n(data.count)})`} id={this.props.id}>
          {this.props.showExport ? (
            <ExportButton filename='appeals'
              qs={this.getQs(this.props)}
              resource='api/v2/appeal'
            />
          ) : null}
          <DisplayTable
            headings={headings}
            rows={rows}
            pageCount={data.count / this.state.table.limit}
            page={this.state.table.page - 1}
            onPageChange={this.handlePageChange.bind(this, 'table')}
            noPaginate={this.props.noPaginate}
          />
          {this.props.viewAll ? (
            <div className='fold__footer'>
              <Link className='link--primary export--link' to={this.props.viewAll}>{this.props.viewAllText || 'View all appeals'}</Link>
            </div>
          ) : null}
        </Fold>
      );
    }
    return null;
  }
}

if (environment !== 'production') {
  AppealsTable.propTypes = {
    _getAppeals: T.func,
    appeals: T.object,

    limit: T.number,
    country: T.number,
    region: T.number,
    atype: T.string,
    record: T.string,

    noPaginate: T.bool,
    showExport: T.bool,
    title: T.string,

    showActive: T.bool,
    viewAll: T.string,
    viewAllText: T.string,
    id: T.string,

    action: T.string,
    statePath: T.string
  };
}

const selector = (state, props) => ({
  appeals: props.statePath ? get(state, props.statePath) : state.appeals
});

const dispatcher = (dispatch) => ({
  _getAppeals: (...args) => dispatch(getAppeals(...args))
});

export default connect(selector, dispatcher)(AppealsTable);