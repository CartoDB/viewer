// This configuration object determines which deck.gl classes are accessible in Playground

import {MapView } from '@deck.gl/core';

import {CartoSQLLayer, CartoBQTilerLayer, BASEMAP} from '@deck.gl/carto';

const config = {
  // Classes that should be instantiatable by JSON converter
  classes: Object.assign(
    {MapView},
    {CartoBQTilerLayer, CartoSQLLayer},
  ),

  enumerations: {
    CARTO_BASEMAP: BASEMAP
  }
};

export default config;


