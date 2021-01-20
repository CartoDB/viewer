import React, { useState } from 'react';
import JSONEditor from '../JsonEditor';
import { makeStyles, Button, Divider, Typography, Box } from '@material-ui/core';

import { ReactComponent as NewTabIcon } from '../../../icons/new-tab.svg';
import cartoFullLogo from '../../../icons/carto-full-logo.svg';

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
}));

function ConfigurationSidebar(props) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const classes = useStyles();

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  const tileJsonUrl = () => {
    const json = props.currentJson;
    let tileJson = '';
    if (json && json.layers && json.layers.length === 1) {
      const credentials = json.layers[0].credentials;
      if (!credentials) return '';
      const username = credentials['username'];
      const apiKey = credentials['apiKey'];
      const region = credentials['region'] ? credentials['region'] : 'us';
      const data = json.layers[0].data;
      if (json.layers[0]['@@type'] === 'CartoBQTilerLayer')
        tileJson = `https://maps-api-v2.${region}.carto.com/user/${username}/tilejson/tileset/bigquery/${data}?api_key=${apiKey}`;
      else if (json.layers[0]['@@type'] === 'CartoSQLLayer') {
        tileJson = `https://maps-api-v2.${region}.carto.com/user/${username}/tilejson/sql/postgres/${encodeURIComponent(
          data
        )}?api_key=${apiKey}`;
      }
    }
    return tileJson;
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
              <Typography variant='subtitle1'>deck.gl styling</Typography>
            </Box>
            <Typography mt={1} variant='caption' className={classes.textColor}>
              You can customize how the visualization looks like by modifying the deck.gl
              declarative language.
              <br />
              Check out our{' '}
              <a
                href='https://carto.com/developers/'
                target='_blank'
                rel='noopener noreferrer'
              >
                examples
              </a>{' '}
              and{' '}
              <a
                href='https://carto.com/developers/'
                target='_blank'
                rel='noopener noreferrer'
              >
                documentation
              </a>{' '}
              to learn about it.
            </Typography>
          </Box>
        )}
      </div>
      <div
        className={`configuration-sidebar__section configuration-sidebar__section--editor open`}
      >
        <div className='section-content no-side-padding'>
          {props.json && (
            <JSONEditor onJsonUpdated={props.onJsonUpdated} json={props.json} />
          )}
          {tileJsonUrl() && (
            <div className={classes.tilsetFooter}>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfigurationSidebar;
