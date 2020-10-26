import DeckWithMapboxMaps from './deck-with-mapbox-maps';
import DeckWithGoogleMaps from './deck-with-google-maps';
import {StaticMap} from 'react-map-gl';
import {BASEMAP} from '@deck.gl/carto';

const GOOGLE_MAPS_TOKEN = "AIzaSyCb2CTi3B6uarznVAs33W8VMER-1wz3ZrI"

export default function Map(props) {
  let deckMap;
  if (props && props.jsonProps && props.jsonProps.google) {
    deckMap = (
      <DeckWithGoogleMaps
        id="json-deck"
        {...props.jsonProps}
        googleMapsToken={GOOGLE_MAPS_TOKEN}
      />
    );
  } else {
    deckMap = (
      <DeckWithMapboxMaps
        id="json-deck"
        {...props.jsonProps}
        Map={StaticMap}
        mapStyle={BASEMAP.POSITRON}
      />
    );
  }
  
  return deckMap;
};

