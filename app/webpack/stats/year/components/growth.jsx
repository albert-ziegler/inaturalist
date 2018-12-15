import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import moment from "moment";
import { color as d3color } from "d3";
import { COLORS } from "../../../shared/util";
import DateHistogram from "./date_histogram";

const Growth = ( {
  data,
  year
} ) => {
  const label = d => `<strong>${moment( d.date ).add( 2, "days" ).format( "MMMM YYYY" )}</strong>: ${I18n.toNumber( d.value, { precision: 0 } )}`;
  const grayColor = "rgba( 40%, 40%, 40%, 0.5 )";
  const emptyJan = {
    date: `${year + 1}-01-01`,
    total: 0,
    novel: 0,
    value: 0
  };
  let runningTotal = 0;
  let obsData = _.sortBy(
    _.map( data.observations, ( value, date ) => ( { date, value } ) ),
    i => i.date
  );
  obsData = _.map( obsData, interval => {
    runningTotal += interval.value;
    return {
      date: interval.date,
      total: runningTotal,
      novel: interval.value
    };
  } );
  obsData.push( emptyJan );
  const obsSeries = {
    total: {
      title: I18n.t( "running_total" ),
      style: "bar",
      data: obsData.map( interval => ( { date: interval.date, value: interval.total } ) ),
      color: grayColor,
      label
    },
    novel: {
      title: I18n.t( "new_observations" ),
      style: "bar",
      data: obsData.map( interval => ( {
        date: interval.date,
        value: interval.novel,
        offset: interval.total - interval.novel
      } ) ).filter( interval => interval.date < `${year}-01-01` ),
      color: d3color( COLORS.inatGreen ).darker( 2.0 ),
      label
    },
    novelThisYear: {
      title: I18n.t( "new_observations_this_year" ),
      style: "bar",
      data: obsData.map( interval => ( {
        date: interval.date,
        value: interval.novel,
        offset: interval.total - interval.novel
      } ) ).filter( interval => interval.date >= `${year}-01-01` ),
      color: COLORS.inatGreen,
      label
    }
  };
  let taxaSeries;
  if ( data.taxa ) {
    const taxaData = data.taxa.map( i => i );
    taxaData.push( {
      date: `${year + 1}-01-01`,
      accumulated_species_count: 0,
      novel_species_ids: []
    } );
    taxaSeries = {
      total: {
        title: I18n.t( "running_total" ),
        style: "bar",
        data: _.map( taxaData, i => ( {
          date: i.date,
          value: i.accumulated_species_count
        } ) ),
        color: grayColor,
        label
      },
      novel: {
        title: I18n.t( "newly_observed_species" ),
        style: "bar",
        data: _.map( taxaData, i => ( {
          date: i.date,
          value: i.novel_species_ids.length,
          offset: i.accumulated_species_count - i.novel_species_ids.length
        } ) ).filter( interval => interval.date < `${year}-01-01` ),
        color: d3color( COLORS.iconic.Insecta ).darker( 2.0 ),
        label
      },
      novelThisYear: {
        title: I18n.t( "newly_observed_species_this_year" ),
        style: "bar",
        data: _.map( taxaData, i => ( {
          date: i.date,
          value: i.novel_species_ids.length,
          offset: i.accumulated_species_count - i.novel_species_ids.length
        } ) ).filter( interval => interval.date >= `${year}-01-01` ),
        color: COLORS.iconic.Insecta,
        label
      }
    };
  }
  runningTotal = 0;
  const userData = _.map(
    _.sortBy( _.map( data.users, ( value, date ) => ( { date, value } ) ), i => i.date ),
    i => {
      runningTotal += i.value;
      return {
        date: i.date,
        total: runningTotal,
        novel: i.value
      };
    }
  );
  userData.push( emptyJan );
  const usersSeries = {
    total: {
      title: I18n.t( "running_total" ),
      style: "bar",
      data: userData.map( interval => ( { date: interval.date, value: interval.total } ) ),
      color: grayColor,
      label
    },
    novel: {
      title: I18n.t( "new_users" ),
      style: "bar",
      data: userData.map( interval => ( {
        date: interval.date,
        value: interval.novel,
        offset: interval.total - interval.novel
      } ) ).filter( interval => interval.date < `${year}-01-01` ),
      color: d3color( COLORS.iconic.Animalia ).darker( 2.0 ),
      label
    },
    novelThisYear: {
      title: I18n.t( "new_users_this_year" ),
      style: "bar",
      data: userData.map( interval => ( {
        date: interval.date,
        value: interval.novel,
        offset: interval.total - interval.novel
      } ) ).filter( interval => interval.date >= `${year}-01-01` ),
      color: COLORS.iconic.Animalia,
      label
    }
  };
  return (
    <div className="Growth">
      <h3><span>{ I18n.t( "views.stats.year.growth_title" ) }</span></h3>
      <DateHistogram series={obsSeries} legendPosition="nw" margin={{ left: 60 }} />
      { taxaSeries && <DateHistogram series={taxaSeries} legendPosition="nw" margin={{ left: 60 }} /> }
      <DateHistogram series={usersSeries} legendPosition="nw" margin={{ left: 60 }} />
    </div>
  );
};

Growth.propTypes = {
  data: PropTypes.object,
  year: PropTypes.number
};

export default Growth;
