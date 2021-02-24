import React, { useState, useEffect, useCallback, useRef } from 'react';
import JSONEditor from '../JsonEditor';
import { makeStyles, Button, Divider, Typography, Box } from '@material-ui/core';

import { ReactComponent as NewTabIcon } from '../../../icons/new-tab.svg';
import { ReactComponent as CopyIcon } from '../../../icons/copyIconGreen.svg';
import cartoFullLogo from '../../../icons/carto-full-logo.svg';
import { getTileJsonURL } from 'utils/tileJsonURL';

const useStyles = makeStyles((theme) => ({
  cartoLogo: {
    height: '24px',
  },
  textColor: {
    color: theme.palette.text.primary,
  },
  appName: {
    textTransform: 'uppercase',
    opacity: '0.6',
  },
  tilsetFooter: {
    height: '52px',
    padding: '8px 16px',
    backgroundColor: theme.palette.text.primary,
  },
  regular: {
    'font-weight': theme.typography.fontWeightRegular,
    '& strong': {
      'font-weight': theme.typography.fontWeightBold,
    },
  },
}));

function ConfigurationSidebar(props) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [jsonEditor, setJsonEditor] = useState(null);
  const [xyzUrl, setXyzUrl] = useState('');
  const classes = useStyles();
  const xyzUrlRef = useRef();

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  useEffect(() => {
    if (jsonEditor) {
      jsonEditor.resize();
    }
  }, [jsonEditor, showMoreInfo]);

  const tileJsonUrl = useCallback(() => {
    const json = props.currentJson;
    let tileJson = '';
    if (json && json.layers && json.layers.length === 1) {
      const credentials = json.layers[0].credentials;
      if (!credentials) return '';
      const username = credentials['username'];
      const apiKey = credentials['apiKey'];
      const data = json.layers[0].data;
      tileJson = getTileJsonURL(username, apiKey, data, props.type);
    }
    return tileJson;
  }, [props.currentJson, props.type]);

  useEffect(() => {
    async function fetchTileJson() {
      const tileJson = await (await fetch(tileJsonUrl())).json();
      setXyzUrl(tileJson && tileJson.tiles && tileJson.tiles[0]);
    }
    fetchTileJson();
  }, [tileJsonUrl]);

  const onJsonEditorLoaded = (editor) => {
    setJsonEditor(editor);
  };

  const copyXyzUrl = (e, reference) => {
    const textArea = document.createElement('textarea');
    textArea.value = xyzUrl;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
    } catch {
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className='configuration-sidebar'>
      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <img className={classes.cartoLogo} src={cartoFullLogo} alt='CARTO' />
        <Typography
          className={`${classes.appName} ${classes.textColor}`}
          variant='caption'
        >
          Map Viewer
        </Typography>
      </Box>
      <Divider />
      <div className='section-title'>
        <Box m={2} ml={3} display='flex' justifyContent='space-between'>
          <Typography variant='h6'>Map Style</Typography>
          <Button variant='text' color='primary' size='small' onClick={toggleMoreInfo}>
            More info
          </Button>
        </Box>
        {showMoreInfo && (
          <Box m={2} ml={3} p={2} bgcolor='background.default' borderRadius='4px'>
            <Box mb={1}>
              <Typography variant='subtitle2'>deck.gl styling</Typography>
            </Box>
            <Typography
              component='p'
              mt={1}
              variant='caption'
              color='textSecondary'
              className={classes.regular}
            >
              You can customize the cartography using deck.gl’s style language.<br></br>
              Review our{' '}
              <a
                href=' https://docs.carto.com/deck-gl/guides/style-language'
                target='_blank'
                rel='noopener noreferrer'
              >
                documentation
              </a>{' '}
              to explore its capabilities and get examples.
            </Typography>
          </Box>
        )}
      </div>
      <div
        className={`configuration-sidebar__section configuration-sidebar__section--editor open`}
      >
        <div className='section-content no-side-padding'>
          {props.json && (
            <JSONEditor
              onJsonUpdated={props.onJsonUpdated}
              json={props.json}
              onLoad={onJsonEditorLoaded}
            />
          )}
          {tileJsonUrl() && (
            <Box className={classes.tilsetFooter} display='flex' alignItems='center'>
              <Button
                href={tileJsonUrl()}
                target='_blank'
                startIcon={<NewTabIcon />}
                color='secondary'
                size='medium'
                rel='noopener noreferrer'
              >
                Open TileJSON
              </Button>
              <Box ml={4}>
                <Button
                  target='_blank'
                  startIcon={<CopyIcon />}
                  color='secondary'
                  size='medium'
                  rel='noopener noreferrer'
                  onClick={(e) => copyXyzUrl(e, xyzUrlRef)}
                >
                  Copy XYZ Tile URL
                </Button>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfigurationSidebar;
