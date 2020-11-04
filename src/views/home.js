import {useState, useEffect} from 'react';
import {useLocation, useParams} from "react-router-dom";
import {JSONConverter, JSONConfiguration} from '@deck.gl/json';
import JSON_CONVERTER_CONFIGURATION from '../json/configuration';
import Map from '../components/map';
import Sidebar from '../components/sidebar';

const DEFAULT_DATA = {
  'sql': 'TYPE A SQL QUERY OR A DATASET NAME',
  'tileset': 'TYPE A TILESET NAME',
};
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

function parseConfig(query, username, type ) {
  
  const config = query.get('config');
  let json;
  let ready;

  if (!config) {
    // valid sources are postgres and bigquery
    let data = query.get('data') || DEFAULT_DATA[type];
    const apiKey =  query.get('api_key') || 'default_public';
    const colorByValue = query.get('color_by_value');

    ready = 
      data !== DEFAULT_DATA['sql'] &&
      data !== DEFAULT_DATA['tileset'];
      
    // fetch template and set parameters
    json = require(`../json/template.${type}.json`);
    json.layers[0].data = data;
    json.layers[0].credentials = {username, apiKey}
    if (colorByValue) {
      json.layers[0].getFillColor = 
        `@@= properties.${colorByValue} > 1000000 ? [207, 89, 126] : properties.${colorByValue} > 100000 ? [232, 133, 113] : properties.${colorByValue} > 10000 ? [238, 180, 121] : properties.${colorByValue} > 1000 ? [233, 226, 156] : properties.${colorByValue} > 100 ? [156, 203, 134] : properties.${colorByValue} > 10 ? [57, 177, 133] : [0, 147, 146]`;
    }
  } else {
    json = JSON.parse(config);
    ready = true;
  }

  return {json, ready};
}


function Home() {
  const [json, setJSON] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const location = useLocation();
  const {username, type} = useParams();

  useEffect(() => {

    if (!username) {
      throw Error(`Unknowm type ${type}`)
    }
  
    if (type!== 'sql' && type!=='bigquery'){
      throw Error(`Unknowm type ${type}`)
    }
  
    const query = new URLSearchParams(location.search);
    setSidebarVisible(!query.get('embed'));
    const {json, ready} = parseConfig(query, username, type);
    setJSON(json);
    // Display config if something is missing and the map is not ready
  }, [location, username, type]);

  useEffect(() => {
    addUpdateTriggersForAccesors(json);
    const jsonProps = jsonConverter.convert(json);
    setJSONPros(jsonProps);
  }, [json]);

  const onEditorChange = (jsonText) => {
    setJSON(JSON.parse(jsonText));
  }

  const onBasemapChange = (newBasemap) => {
    var currentJson = {...json};
    if (newBasemap === 'carto')
      delete currentJson["google"];
    else if (newBasemap === 'gmaps')
      currentJson["google"] = true;
    setJSON(currentJson);
  }

  const onStyleChange = (e) => {
    var newStyle = e.target.value;
    var newJson = {...json};
    var index = -1;
    for(var i in newJson["views"]) {
      if(newJson["views"][i]["@@type"] === "MapView") {
        index = i;
        break;
      }
    }
    if(index >= 0)
      newJson["views"][index]["mapStyle"] = newStyle;
    else {  
      if(!newJson["views"])
        newJson["views"] = [];
      const newObject = {
        "@@type": "MapView",
        "controller": true,
        "mapStyle": newStyle
      }
      newJson["views"].push(newObject);
    }
    setJSON(newJson);
  }

  const onZoom = (e) => {
    var zoomType = e.target.dataset.type;
    var newJson = {...json};
    if (zoomType === "zoom-in" && newJson["initialViewState"]["zoom"] < 20){
      newJson["initialViewState"]["zoom"]++
      setJSON(newJson);
    }
    else if (zoomType === "zoom-out" && newJson["initialViewState"]["zoom"] > 0) {
      newJson["initialViewState"]["zoom"]--
      setJSON(newJson);
    }
  }

  return (
      <div className='home'>
        {sidebarVisible && 
          <Sidebar onBasemapChange={onBasemapChange} onStyleChange={onStyleChange} json={json} onJsonUpdated={onEditorChange}></Sidebar>
        }         
        <div className='map'>
          {jsonProps && 
            <Map {...jsonProps} json={json} onZoom={onZoom}/>
          }
        </div>
      </div>
  );
}

export default Home;
