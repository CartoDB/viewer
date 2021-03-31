import React from 'react';
import { Box, Divider, makeStyles, Typography } from '@material-ui/core';

import cartoFullLogo from '../../../icons/carto-full-logo.svg';

const useStyles = makeStyles((theme) => ({
  cartoLogo: {
    height: '24px',
  },
  appName: {
    textTransform: 'uppercase',
    opacity: '0.6',
  },
}));

function HeaderSidebar() {
  const classes = useStyles();

  return (
    <div className='header-sidebar'>
      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <img className={classes.cartoLogo} src={cartoFullLogo} alt='CARTO' />
        <Typography className={classes.appName} variant='caption' color='textPrimary'>
          Map Viewer
        </Typography>
      </Box>
      <Divider />
    </div>
  );
}

export default HeaderSidebar;
