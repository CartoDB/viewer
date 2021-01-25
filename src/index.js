import init from './init';

const element = document.getElementById('root');

const api_key = 'default_public';
const props = {
  username: 'alasarr',
  type: 'bigquery',
  query: new URLSearchParams(`?data=cartobq.maps.osm_buildings&api_key=${api_key}`),
  shareOptions: {
    baseUrl: 'https://viewer.carto.com/',
  },
};

init(element, props);

// init(element);
