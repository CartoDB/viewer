import React, { useState, useEffect } from 'react';
import JSONEditor from '../components/json-editor';
import { makeStyles, Button, Divider, Typography, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  cartoLogo: {
    height: '24px',
  },
  appName: {
    textTransform: 'uppercase',
    opacity: '0.6',
  },
}));

function ConfigurationSidebar(props) {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const classes = useStyles();

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
  };

  return (
    <div className='configuration-sidebar'>
      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <img className={classes.cartoLogo} src='/icons/carto-full-logo.svg' alt='CARTO' />
        <Typography className={classes.appName} variant='caption' color='text.primary'>
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
            <Typography mt={1} variant='caption' color='text.primary'>
              You can customize how the visualization looks like by modifying the deck.gl
              declarative language.
              <br />
              Check out our <a href='#'>examples</a> and <a href='#'>documentation</a> to
              learn about it.
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
        </div>
      </div>
    </div>
  );
}

export default ConfigurationSidebar;
