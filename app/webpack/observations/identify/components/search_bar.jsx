import React, { PropTypes } from "react";
import { Input, Button } from "react-bootstrap";
import TaxonAutocomplete from "./taxon_autocomplete";
import PlaceAutocomplete from "./place_autocomplete";

const SearchBar = ( {
  params,
  updateSearchParams
} ) => (
  <form className="SearchBar form-inline">
    <TaxonAutocomplete
      bootstrapClear
      searchExternal={false}
      afterSelect={ function ( result ) {
        // do we need to add selectedTaxon to the state? could it rest within some other reducer?
        updateSearchParams( { taxon_id: result.item.id } );
      } }
      afterUnselect={ function ( ) {
        updateSearchParams( { taxon_id: null } );
      } }
    />
    <PlaceAutocomplete
      afterSelect={ function ( result ) {
        updateSearchParams( { place_id: result.item.id } );
      } }
      afterUnselect={ function ( ) {
        updateSearchParams( { place_id: null } );
      } }
    />
    <Button bsStyle="primary">{ I18n.t( "go" ) }</Button>
    <Button>{ I18n.t( "filters" ) }</Button>
    <Input
      type="checkbox"
      label={ I18n.t( "reviewed" ) }
      checked={ params.reviewed }
      onChange={function ( e ) {
        updateSearchParams( { reviewed: e.target.checked } );
      }}
    />
  </form>
);


SearchBar.propTypes = {
  params: PropTypes.object,
  updateSearchParams: PropTypes.func
};

export default SearchBar;
