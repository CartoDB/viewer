import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setBaseMap } from '@carto/react/redux';
import { JSONConverter, JSONConfiguration } from '@deck.gl/json';
import JSON_CONVERTER_CONFIGURATION from '../../json/configuration';
import { makeStyles } from '@material-ui/core';

import { Map } from '../common/Map';
import Sidebar from '../common/Sidebar/Sidebar';
import BasemapSelector from '../common/BasemapSelector';
import { setViewState } from '@carto/react/redux';
import {
  POSITRON,
  VOYAGER,
  DARK_MATTER,
  GOOGLE_ROADMAP,
  GOOGLE_SATELLITE,
} from '@carto/react/basemaps';

const DEFAULT_DATA = {
  sql: 'TYPE A SQL QUERY OR A DATASET NAME',
  bigquery: 'TYPE A TILESET NAME',
};
const configuration = new JSONConfiguration(JSON_CONVERTER_CONFIGURATION);
const jsonConverter = new JSONConverter({ configuration });

const useStyles = makeStyles((theme) => ({
  map: {
    position: 'relative',
    overflow: 'hidden',
    flexGrow: 1,
    border: '8px solid rgba(44, 48, 50, 0.05)',

    '&::after': {
      content: '""',
      position: 'absolute',
      backgroundImage: 'url("/icons/carto-watermark-logo.svg")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'contain',
      bottom: '4px',
      left: '50%',
      height: '30px',
      width: '100px',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
    },
  },
}));

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

function parseConfig(query, username, type) {
  const config = query.get('config');
  let json;
  let ready;

  if (!config) {
    let data = query.get('data') || DEFAULT_DATA[type];
    const apiKey = query.get('api_key') || 'default_public';
    const colorByValue = query.get('color_by_value');

    ready = data !== DEFAULT_DATA['sql'] && data !== DEFAULT_DATA['tileset'];

    json = require(`../../json/template.${type}.json`);
    json.layers[0].data = data;
    json.layers[0].credentials = { username, apiKey };
    if (colorByValue) {
      json.layers[0].getFillColor = {
        '@@function': 'colorBins',
        attr: colorByValue,
        domain: [10, 100, 1000, 10000, 100000, 1000000],
        colors: 'Temps',
      };
    }
  } else {
    json = JSON.parse(atob(decodeURIComponent(config)));
    ready = true;
  }
  return { json, ready };
}

function Home() {
  const [json, setJSON] = useState();
  const [jsonMap, setJSONMap] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const [embedMode, setEmbedMode] = useState(false);
  const location = useLocation();
  const { username, type } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();

  const initBasemap = useCallback(
    (mapJson) => {
      if (mapJson['google']) dispatch(setBaseMap(GOOGLE_ROADMAP));
      else {
        for (var i in mapJson['views']) {
          if (mapJson['views'][i]['@@type'] === 'MapView') {
            const style = mapJson['views'][i]['mapStyle'].toUpperCase();
            if (style.includes('positron'.toUpperCase())) dispatch(setBaseMap(POSITRON));
            else if (style.includes('dark_matter'.toUpperCase()))
              dispatch(setBaseMap(DARK_MATTER));
            else if (style.includes('voyager'.toUpperCase()))
              dispatch(setBaseMap(VOYAGER));
            break;
          }
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (!username) {
      throw Error(`Unknowm type ${type}`);
    }

    if (type !== 'sql' && type !== 'bigquery') {
      throw Error(`Unknowm type ${type}`);
    }

    const query = new URLSearchParams(location.search);
    setEmbedMode(query.get('embed'));
    const { json, ready } = parseConfig(query, username, type);
    if (!ready) {
      setEmbedMode(false);
    }
    initBasemap(json);
    setJSON(json);
    setJSONMap(json);
  }, [location, username, type, initBasemap]);

  useEffect(() => {
    if (jsonMap) {
      try {
        const tempJson = JSON.parse(JSON.stringify(jsonMap));
        addUpdateTriggersForAccesors(tempJson);
        let jsonProps = jsonConverter.convert(tempJson);
        jsonProps = checkJsonProps(jsonProps);
        setJSONPros(jsonProps);
      } catch (e) {
        console.log('ERROR: ', e);
      }
    }
  }, [jsonMap]);

  useEffect(() => {
    if (jsonProps) {
      dispatch(setViewState(jsonProps.initialViewState));
    }
  }, [dispatch, jsonProps]);

  const checkJsonProps = (json) => {
    if (json && json.initialViewState) {
      json.initialViewState['zoom'] = json.initialViewState.zoom
        ? json.initialViewState.zoom
        : 0;
      json.initialViewState['latitude'] = json.initialViewState.latitude
        ? json.initialViewState.latitude
        : 0;
      json.initialViewState['longitude'] = json.initialViewState.longitude
        ? json.initialViewState.longitude
        : 0;
    }
    return json;
  };

  const onEditorChange = (jsonText) => {
    const tempJson = JSON.parse(jsonText);
    setJSONMap(tempJson);
  };

  const onBasemapChange = (newBasemap) => {
    debugger;
    console.log('onBasemapChange');
    var currentJson = { ...jsonMap };
    if (newBasemap === GOOGLE_ROADMAP || newBasemap === GOOGLE_SATELLITE)
      currentJson['google'] = true;
    else {
      delete currentJson['google'];
      onStyleChange(newBasemap);
    }
    setJSON(currentJson);
    setJSONMap(currentJson);
  };

  const onMenuCloses = (e) => {
    setJSON(jsonMap);
  };

  const onStyleChange = (newBasemap) => {
    let newStyle;
    switch (newBasemap) {
      case VOYAGER:
        newStyle = '@@#CARTO_BASEMAP.VOYAGER';
        break;
      case DARK_MATTER:
        newStyle = '@@#CARTO_BASEMAP.DARK_MATTER';
        break;
      default:
        newStyle = '@@#CARTO_BASEMAP.POSITRON';
    }
    let newJson = { ...jsonMap };
    let index = -1;
    for (var i in newJson['views']) {
      if (newJson['views'][i]['@@type'] === 'MapView') {
        index = i;
        break;
      }
    }
    if (index >= 0) newJson['views'][index]['mapStyle'] = newStyle;
    else {
      if (!newJson['views']) newJson['views'] = [];
      const newObject = {
        '@@type': 'MapView',
        controller: true,
        mapStyle: newStyle,
      };
      newJson['views'].push(newObject);
    }
    setJSON(newJson);
    setJSONMap(newJson);
  };

  return (
    <div className={`home ${embedMode ? 'home--embed' : ''}`}>
      {!embedMode && (
        <Sidebar
          onStyleChange={onStyleChange}
          onMenuCloses={onMenuCloses}
          onJsonUpdated={onEditorChange}
          json={json}
          jsonMap={jsonMap}
        />
      )}
      <div className={classes.map}>
        {jsonProps && <Map {...jsonProps} />}
        {json && (
          <BasemapSelector
            onBasemapChange={onBasemapChange}
            onStyleChange={onStyleChange}
            json={json}
          />
        )}
      </div>
      {embedMode && (
        <div className='footer'>
          <p class='footer__text'>
            <img src='/icons/carto-heart.png' alt='' />
            Created with{' '}
            <a href='https://carto.com' target='_blank' rel='noopener noreferrer'>
              CARTO
            </a>
          </p>
          <a
            class='footer__logo'
            href='https://carto.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src='/icons/carto-full-logo.svg' alt='CARTO' />
          </a>
        </div>
      )}
    </div>
  );
}

export default Home;
