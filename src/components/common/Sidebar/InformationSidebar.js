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
    return !!json; // TODO: !!json.do_metadata;
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
            This dataset provides estimates for a set of risk factors (age, number of
            household residents, smoking habits, etc.) and COVID-19 infection rates at a
            range of local geographies.
          </Typography>
        </Box>
        <Box mt={2}>
          {isDOTileset ? (
            <div>
              <Typography className={classes.link} variant='body2'>
                <Link to={'#'}>Access this dataset in the Data Observatory</Link>
              </Typography>
              <Typography className={classes.link} variant='body2'>
                <Link to={'#'}>Learn more about Data Observatory for Developers</Link>
              </Typography>
            </div>
          ) : (
            <Typography className={classes.link} variant='body2'>
              <a
                href='https://docs.carto.com/spatial-extension-bq/tilesets/overview/'
                rel='noreferrer noopener'
                target='_blank'
              >
                Learn more about tilesets
              </a>
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default InformationSidebar;
