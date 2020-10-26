import {useState, useEffect} from 'react';
import {useLocation} from "react-router-dom";
import {JSONConverter, JSONConfiguration} from '@deck.gl/json';
import JSON_CONVERTER_CONFIGURATION from '../json/configuration';
import Map from '../components/map';
import JSONEditor from '../components/json-editor';

const configuration = new JSONConfiguration(JSON_CONVERTER_CONFIGURATION);
const jsonConverter = new JSONConverter({configuration});

function addUpdateTriggersForAccesors(json) {
  if (!json || !json.layers) return;

  for (const layer of json.layers) {
    const updateTriggers = {};
    for (const [key, value] of Object.entries(layer)) {
      if (key.startsWith('get') && typeof value === 'string') {
        // it's an accesor and it's a string
        // we add the value of the accesor to update trigger to refresh when it changes
        updateTriggers[key] = value;
      }
    }
    if (Object.keys(updateTriggers).length) {
      layer.updateTriggers = updateTriggers;
    }
  }
}

function getDefaultData(type) {
  return (type === 'sql')
    ? 'SELECT the_geom_webmercator FROM populated_places' 
    : 'cartobq.maps.osm_buildings';
}


function Home() {
  const [json, setJSON] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const location = useLocation();

  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    // valid types are query and tileset
    const type = query.get('type') || 'sql'
    // valid sources are postgres and bigquery
    const source = query.get('source') || 'postgres'
    const data = query.get('data') || getDefaultData(type);
    const username = query.get('username') || 'public';
    const apiKey =  query.get('apiKey') || 'default_public';

    // fetch template and set parameters
    const json = require(`../json/template.${type}.${source}.json`);
    json.layers[0].data = data;
    
    if (type==='sql') {
      json.layers[0].credentials = { username, apiKey}
    }

    setJSON(json);
    
  }, [location]);

  useEffect(() => {
    addUpdateTriggersForAccesors(json);
    const jsonProps = jsonConverter.convert(json);
    setJSONPros({jsonProps});
  }, [json]);

  const onEditorChange = (jsonText) => {
    console.log(jsonText);
    setJSON(JSON.parse(jsonText));
  }

  return (
      <div className='app-container'>
        <div className='editor'>
          {json &&
          <JSONEditor onChange={onEditorChange} json={json}/>
          }
        </div>
        <div className='map'>
          <Map {...jsonProps} />
        </div>
      </div>
  );
}

export default Home;