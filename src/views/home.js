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
    json = JSON.parse(atob(decodeURIComponent(config)));
    ready = true;
  }

  return {json, ready};
}


function Home() {
  const [json, setJSON] = useState();
  const [jsonMap, setJSONMap] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const [viewState, setViewState] = useState(null);
  const [embedMode, setEmbedMode] = useState(false);
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
    setEmbedMode(query.get('embed'));
    const {json, ready} = parseConfig(query, username, type);
    if (!ready) {
      setEmbedMode(false);
    }
    setJSON(json);
    setJSONMap(json);
    // Display config if something is missing and the map is not ready
  }, [location, username, type]);

  useEffect(() => {
    addUpdateTriggersForAccesors(jsonMap);
    let jsonProps = jsonConverter.convert(jsonMap);
    jsonProps = checkJsonProps(jsonProps)
    setJSONPros(jsonProps);
  }, [jsonMap]);

  const checkJsonProps = (json) => {
    if (json && json.initialViewState) {
      json.initialViewState["zoom"] = json.initialViewState.zoom ? json.initialViewState.zoom : 0;
      json.initialViewState["latitude"] = json.initialViewState.latitude ? json.initialViewState.latitude : 0;
      json.initialViewState["longitude"] = json.initialViewState.longitude ? json.initialViewState.longitude : 0;
    }
    return json;
  }

  const onEditorChange = (jsonText) => {
    const tempJson = JSON.parse(jsonText)
    setJSONMap(tempJson);
    setViewState(tempJson.initialViewState);
  }

  const onBasemapChange = (newBasemap) => {
    var currentJson = {...jsonMap};
    if (newBasemap === 'carto')
      delete currentJson["google"];
    else if (newBasemap === 'gmaps')
      currentJson["google"] = true;
    if(viewState)
      currentJson.initialViewState = viewState;
    setJSON(currentJson);
    setJSONMap(currentJson);
  }

  const onGmapUpdate = (map) => {
    const newViewState = {...viewState};
    newViewState.latitude = map.getCenter().lat();
    newViewState.longitude = map.getCenter().lng();
    newViewState.zoom = map.getZoom();
    setViewState(newViewState);
  }

  const onMenuCloses = (e) => {
    setJSON(jsonMap);
  }

  const onViewStateChange = (e) => {
    if (!e.interactionState.isDragging){
      delete e.viewState["height"];
      delete e.viewState["width"];
      setViewState(e.viewState);
    }
  }

  const onStyleChange = (e) => {
    var newStyle = e.target.value;
    var newJson = {...jsonMap};
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
    setJSONMap(newJson);
  }

  const onZoom = (e) => {
    var zoomType = e.target.dataset.type;
    var newJson = {...jsonMap};
    if (viewState)
      newJson["initialViewState"] = {...viewState}
    if (zoomType === "zoom-in"){
      const currentZoom = newJson["initialViewState"]["zoom"];
      newJson["initialViewState"]["zoom"] = currentZoom > 19 ? 20 : currentZoom + 1
      setViewState(newJson["initialViewState"]);
      setJSONMap(newJson);
    }
    else if (zoomType === "zoom-out") {
      const currentZoom = newJson["initialViewState"]["zoom"];
      newJson["initialViewState"]["zoom"] = currentZoom < 2 ? 1 : currentZoom - 1
      setViewState(newJson["initialViewState"]);
      setJSONMap(newJson);
    }
  }

  return (
      <div className={`home ${embedMode ? 'home--embed':''}`}>
        {!embedMode && 
          <Sidebar
            onBasemapChange={onBasemapChange}
            onStyleChange={onStyleChange}
            onMenuCloses={onMenuCloses}
            onJsonUpdated={onEditorChange}
            json={json}
            jsonMap={jsonMap}
            viewState={viewState}/>
        }         
        <div className='map'>
          {jsonProps && 
            <Map {...jsonProps} onViewStateChange={onViewStateChange} onZoom={onZoom} onGmapUpdate={onGmapUpdate}/>
          }
        </div>
        {embedMode && 
          <div className="footer">
            <p class="footer__text">
              <img src="/icons/carto-heart.png" alt=""/>
              Created with <a href="https://carto.com" target="_blank" rel="noreferrer">CARTO</a>
            </p>
            <a class="footer__logo" href="https://carto.com" target="_blank" rel="noreferrer">
              <img src="/icons/carto-full-logo.svg" alt="CARTO"/>
            </a>
          </div>
          }
      </div>
  );
}

export default Home;
