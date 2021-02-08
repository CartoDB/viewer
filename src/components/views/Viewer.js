import React, { useState, useEffect, useCallback } from 'react';
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

import cartoWatermarkLogo from '../../icons/carto-watermark-logo.svg';
import cartoHeart from '../../icons/carto-heart.png';
import cartoFullLogo from '../../icons/carto-full-logo.svg';
import NotFound from './NotFound';

const DEFAULT_DATA = {
  sql: 'TYPE A SQL QUERY OR A DATASET NAME',
  bigquery: 'TYPE A TILESET NAME',
};
const configuration = new JSONConfiguration(JSON_CONVERTER_CONFIGURATION);
const jsonConverter = new JSONConverter({ configuration });

const useStyles = makeStyles((theme) => ({
  home: {
    display: 'flex',
    width: '100vw',
    height: '100vh',
  },
  'home--embed': {
    'flex-direction': 'column',
  },
  map: {
    position: 'relative',
    overflow: 'hidden',
    flexGrow: 1,
    border: '8px solid rgba(44, 48, 50, 0.05)',

    '&::after': {
      content: '""',
      position: 'absolute',
      backgroundImage: `url(${cartoWatermarkLogo})`,
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
    '& #deckgl-wrapper': {
      overflow: 'hidden',
      'border-radius': '4px',
    },
  },
  footer: {
    display: 'flex',
    'align-items': 'center',
    'background-color': 'rgba(44, 48, 50, 0.05)',
    height: '22px',
    padding: '0 8px 8px',
  },
  footer__text: {
    'font-size': '12px',
    'line-height': '16px',
    '& a': {
      color: '#1785fb',
    },
    '& img': {
      height: '16px',
      width: '16px',
      'margin-right': '8px',
      'vertical-align': 'middle',
    },
  },
  footer__logo: {
    'margin-left': 'auto',
    '& img': {
      display: 'block',
      height: '18px',
    },
  },
}));

function addUpdateTriggersForAccesors(json) {
  if (!json || !json.layers) return;

  for (const layer of json.layers) {
    const updateTriggers = {};
    for (const [key, value] of Object.entries(layer)) {
      if (
        key.startsWith('get') &&
        (typeof value === 'string' || typeof value === 'object')
      ) {
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
    const initialViewState = query.get('initialViewState');

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
    if (initialViewState) {
      json.initialViewState = {
        ...json.initialViewState,
        ...JSON.parse(initialViewState),
      };
    }
  } else {
    json = JSON.parse(atob(decodeURIComponent(config)));
    ready = true;
  }

  if (json.layers && json.layers[0]) {
    json.layers[0].onDataError = {
      '@@function': 'onDataError',
    };
  }

  return { json, ready };
}

function cleanJson(json) {
  const result = json && JSON.parse(JSON.stringify(json));
  if (result && result.layers && result.layers[0]) {
    delete result.layers[0].onDataError;
  }
  return result;
}

function Viewer(props) {
  const [json, setJSON] = useState();
  const [showNotFoundScreen, setShowNotFoundScreen] = useState(false);
  const [jsonMap, setJSONMap] = useState();
  const [jsonProps, setJSONPros] = useState(null);
  const [embedMode, setEmbedMode] = useState(false);
  const { username, type, query, shareOptions } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  jsonConverter.configuration.functions.onDataError = () => {
    return (error) => {
      if (error.message.includes('Unauthorized')) {
        setShowNotFoundScreen(true);
      }
    };
  };

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

  const onJSONMapChanged = useCallback(
    (mapJson) => {
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
    },
    [jsonMap]
  );

  useEffect(() => {
    if (!username) {
      throw Error(`Unknowm type ${type}`);
    }

    if (type !== 'sql' && type !== 'bigquery') {
      throw Error(`Unknowm type ${type}`);
    }

    setEmbedMode(query.get('embed'));
    const { json, ready } = parseConfig(query, username, type);
    if (!ready) {
      setEmbedMode(false);
    }
    initBasemap(json);
    setJSON(json);
    setJSONMap(json);
  }, [query, username, type, initBasemap]);

  useEffect(() => {
    onJSONMapChanged();
  }, [onJSONMapChanged]);

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
    var currentJson = { ...jsonMap };
    if (newBasemap === GOOGLE_ROADMAP || newBasemap === GOOGLE_SATELLITE)
      currentJson['google'] = true;
    else {
      delete currentJson['google'];
      onStyleChange(newBasemap);
    }
    setJSON(currentJson);
    setJSONMap(currentJson);
    onJSONMapChanged();
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
    <div>
      {showNotFoundScreen ? (
        <div className={classes.home}>
          <NotFound />
        </div>
      ) : (
        <div className={`${classes.home} ${embedMode ? classes['home--embed'] : ''}`}>
          {!embedMode && (
            <Sidebar
              onStyleChange={onStyleChange}
              onMenuCloses={onMenuCloses}
              onJsonUpdated={onEditorChange}
              json={cleanJson(json)}
              jsonMap={jsonMap}
              goBackFunction={props.goBackFunction}
              username={username}
              type={type}
              shareOptions={shareOptions}
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
            <div className={classes.footer}>
              <p className={classes['footer__text']}>
                <img src={cartoHeart} alt='' />
                Created with{' '}
                <a href='https://carto.com' target='_blank' rel='noopener noreferrer'>
                  CARTO
                </a>
              </p>
              <a
                className={classes['footer__logo']}
                href='https://carto.com'
                target='_blank'
                rel='noopener noreferrer'
              >
                <img src={cartoFullLogo} alt='CARTO' />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Viewer;
