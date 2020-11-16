import DeckWithMapboxMaps from './deck-with-mapbox-maps';
import DeckWithGoogleMaps from './deck-with-google-maps';
import {StaticMap} from 'react-map-gl';
import {BASEMAP} from '@deck.gl/carto';

const GOOGLE_MAPS_TOKEN = "AIzaSyCb2CTi3B6uarznVAs33W8VMER-1wz3ZrI"
const EXCLUDE_PROPS = ['layerName', 'the_geom', 'the_geom_webmercator'];

export default function Map(props) {
  let isHovering = false;

  const getTooltip = (info) => {
    if (info && info.object && info.object.properties) {
      let html = '';
      for (const [key, value] of Object.entries(info.object.properties)) {

        if (!EXCLUDE_PROPS.includes(key)) {
          const isNumber = Number.isFinite(value)
          let o = value;
          if (isNumber) {
            const nDigits = isNumber && Number.isInteger(value) ? 0 : 2;
            o = Intl.NumberFormat('en-US', {
              maximumFractionDigits: nDigits,
              minimumFractionDigits: nDigits,
              notation: 'compact',
              compactDisplay: 'short',
            }).format(value)
          } 

          html += `${key.toUpperCase()}: ${o}<br/>`;
        }
      }

      if (!html) {
        return null;
      }

      return {
        html: `<div>${html}</div>`,
        style: {
          padding: '10px',
          fontSize: '11px'
        },
      };
    }
  };

  const handleHover = ({ object }) => (isHovering = !!object);
  const handleCursor = ({ isDragging }) =>
    isDragging ? 'grabbing' : isHovering ? 'pointer' : 'grab';

  let deckMap;
  if (props && props && props.google) {
    deckMap = (
      <DeckWithGoogleMaps
        id="json-deck"
        {...props}
        googleMapsToken={GOOGLE_MAPS_TOKEN}
        getTooltip={getTooltip}
        onHover={handleHover}
        getCursor={handleCursor}
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
        getTooltip={getTooltip}
        onHover={handleHover}
        getCursor={handleCursor}
      />
    );
  }
  
  return deckMap;
};

