import DeckWithMapboxMaps from './deck-with-mapbox-maps';
import DeckWithGoogleMaps from './deck-with-google-maps';
import {StaticMap} from 'react-map-gl';
import {BASEMAP} from '@deck.gl/carto';

const GOOGLE_MAPS_TOKEN = "AIzaSyCb2CTi3B6uarznVAs33W8VMER-1wz3ZrI"

export default function Map(props) {
  let deckMap;
  if (props && props && props.google) {
    deckMap = (
      <DeckWithGoogleMaps
        id="json-deck"
        {...props}
        googleMapsToken={GOOGLE_MAPS_TOKEN}
      />
    );
  } else {
    deckMap = (
      <DeckWithMapboxMaps
        id="json-deck"
        {...props}
        Map={StaticMap}
        mapStyle={BASEMAP.POSITRON}
        onZoom={props.onZoom}
      />
    );
  }
  
  return deckMap;
};

