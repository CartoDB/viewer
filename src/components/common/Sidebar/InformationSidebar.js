import React, { useMemo } from 'react';
import { Box, makeStyles, Typography } from '@material-ui/core';

import HeaderSidebar from './HeaderSidebar';

import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  link: {
    marginTop: theme.spacing(0.5),
    '& a': {
      textDecoration: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },
}));

function InformationSidebar(props) {
  const json = props.tileJson;
  const isDOTileset = useMemo(() => {
    return !!json.extra_metadata && !!json.extra_metadata['data-observatory'];
  }, [json]);
  console.log(json);

  const classes = useStyles();

  return (
    <div className='information-sidebar'>
      <HeaderSidebar></HeaderSidebar>
      <Box m={2} ml={3} mr={3}>
        <Typography variant='h6' color='textPrimary'>
          About this map
        </Typography>
        <Box mt={3}>
          <Typography variant='subtitle1' color='textPrimary'>
            {json.name}
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant='body2' color='textSecondary'>
            {json.description}
          </Typography>
        </Box>
        <Box mt={2}>
          {isDOTileset ? (
            <div>
              <Typography className={classes.link} variant='body2'>
                <a
                  href={`https://carto.com/spatial-data-catalog/browser/${json.extra_metadata['data-observatory'].type}/${json.extra_metadata['data-observatory'].id}`}
                  rel='noreferrer noopener'
                  target='_blank'
                >
                  Access this dataset in the Data Observatory
                </a>
              </Typography>
              <Typography className={classes.link} variant='body2'>
                <a
                  href='https://docs.carto.com/spatial-extension-bq/overview/tilesets/'
                  rel='noreferrer noopener'
                  target='_blank'
                >
                  Learn how to create tilesets using CARTO's Spatial Extension
                </a>
              </Typography>
            </div>
          ) : (
            <Typography className={classes.link} variant='body2'>
              <a
                href='https://docs.carto.com/spatial-extension-bq/overview/tilesets/'
                rel='noreferrer noopener'
                target='_blank'
              >
                Learn how to create tilesets using CARTO's Spatial Extension
              </a>
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default InformationSidebar;
