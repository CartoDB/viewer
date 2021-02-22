import { getDefaultCredentials } from '@deck.gl/carto';
import { TYPES } from './layerTypes';

export function getTileJsonURL (username, apiKey, data, type) {
  let tileJson = '';
  if (username && apiKey && data) {
    const { region, mapsUrl } = getDefaultCredentials();
    const tileJsonBaseUrl = mapsUrl
      .replace('{region}', region)
      .replace('{user}', username);

    if (type === TYPES.BIGQUERY) {
      tileJson = `${tileJsonBaseUrl}/bigquery/tileset?source=${data}&format=tilejson&api_key=${apiKey}`;
    } else if (type ===  TYPES.SQL) {
      tileJson = `${tileJsonBaseUrl}/carto/sql?source=${encodeURIComponent(
        data
      )}&format=tilejson&api_key=${apiKey}`;
    }
  }
  return tileJson;
}

export function getTileJson (url) {
  return fetch(url).then(response => response.json()).then(data => data)
}