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

function initJSON(query) {
  const config = query.get('config');
  let json;

  if (!config) {
    // valid types are query and tileset
    const type = query.get('type') || 'sql'
    // valid sources are postgres and bigquery
    const source = query.get('source') || 'postgres'
    const data = query.get('data') || getDefaultData(type);
    const username = query.get('username') || 'TYPE YOUR CARTO USERNAME';
    const apiKey =  query.get('api_key') || 'default_public';
    const colorByValue = query.get('color_by_value');

    // fetch template and set parameters
    json = require(`../json/template.${type}.${source}.json`);
    json.layers[0].data = data;
    json.layers[0].credentials = {username, apiKey}
    if (colorByValue) {
      json.layers[0].getFillColor = 
        `@@= properties.${colorByValue} > 1000000 ? [207, 89, 126] : properties.${colorByValue} > 100000 ? [232, 133, 113] : properties.${colorByValue} > 10000 ? [238, 180, 121] : properties.${colorByValue} > 1000 ? [233, 226, 156] : properties.${colorByValue} > 100 ? [156, 203, 134] : properties.${colorByValue} > 10 ? [57, 177, 133] : [0, 147, 146]`;
    }
  } else {
    json = JSON.parse(config);
  }

  return json;
}

function getDefaultData(type) {
  return (type === 'sql')
    ? 'TYPE A SQL QUERY OR A DATASET NAME' 
    : 'TYPE A TILESET NAME';
}

function Home() {
  const [json, setJSON] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const [shareURL, setShareURL] = useState();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const json = initJSON(query);
    setJSON(json);
  }, [location]);

  useEffect(() => {
    addUpdateTriggersForAccesors(json);
    const jsonProps = jsonConverter.convert(json);
    setJSONPros({jsonProps});
  }, [json]);

  const onEditorChange = (jsonText) => {
    setJSON(JSON.parse(jsonText));
  }

  const share = () => {
    const {origin, pathname} = window.location;
    const config = encodeURIComponent(JSON.stringify(json, null, 2));
    const url = `${origin + pathname}?config=${config}`;
    debugger;
    setShareURL(url)
  }

  return (
      <div className='home'>
        <div className='editor'>
          {json &&
            <JSONEditor onChange={onEditorChange} json={json}/>
          }
        </div>
        <div className='share'>
          <button onClick={() => share()}>
            Share
          </button>
          {shareURL &&
            <input value={shareURL} readOnly/>
          }
        </div>
        <div className='map'>
          <Map {...jsonProps} />
        </div>
      </div>
  );
}

export default Home;