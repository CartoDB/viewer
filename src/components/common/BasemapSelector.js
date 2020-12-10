import React, { useState } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { setBaseMap } from '@carto/react/redux';
import {
  POSITRON,
  VOYAGER,
  DARK_MATTER,
  GOOGLE_ROADMAP,
  GOOGLE_SATELLITE,
} from '@carto/react/basemaps';

const useStyles = makeStyles((theme) => ({
  basemapSelectorContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '18px',
    right: '18px',

    '&:not(.is-open) $basemapSelector': {
      opacity: 0,
      position: 'relative',
      width: '56px',
      height: '56px',
      marginTop: '-56px',
      borderColor: theme.palette.common.white,
      zIndex: 1,
    },

    '&:not(.is-open) $basemapSelector.is-selected': {
      opacity: 1,
      position: 'relative',
      width: '56px',
      height: '56px',
      marginTop: '-56px',
      borderColor: theme.palette.common.white,
      zIndex: 1,
    },

    '&.is-open $basemapSelector.is-selected': {
      borderColor: theme.palette.primary.main,
    },

    '&.is-open $basemapSelector': {
      marginTop: '16px',
      pointerEvents: 'all',
    },

    '&.is-open $basemapMain': {
      opacity: 1,
    },
  },

  basemapSelector: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    marginTop: '-48px',
    overflow: 'hidden',
    border: '2px solid rgba(44,48,50,0.12)',
    transition: 'all 0.2s cubic-bezier(.4,.01,.165,.99)',
    pointerEvents: 'none',
    zIndex: 0,
    boxShadow:
      '0 1px 1px 0 rgba(0,0,0,0.08), 0 2px 1px -1px rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.16)',
    cursor: 'pointer',

    '&>img': {
      width: '100%',
      height: '100%',
    },
  },

  basemapMain: {
    opacity: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: theme.palette.common.black,
    cursor: 'pointer',
  },
}));

function BasemapSelector(props) {
  const [selectorsOpen, setSelectorsOpen] = useState(false);
  const basemap = useSelector((state) => state.carto.baseMap);
  const classes = useStyles();
  const dispatch = useDispatch();

  const changeBasemap = (newBasemap) => {
    dispatch(setBaseMap(newBasemap));
    props.onBasemapChange(newBasemap);
  };

  const toggleBasemapSelector = () => {
    setSelectorsOpen(!selectorsOpen);
  };

  return (
    <div
      className={`${classes.basemapSelectorContainer} ${selectorsOpen ? 'is-open' : ''}`}
    >
      <div className={classes.basemapMain} onClick={toggleBasemapSelector}>
        <img src='/icons/close-cross.svg' alt='close' />
      </div>
      <div
        className={`${classes.basemapSelector} ${
          basemap === POSITRON ? 'is-selected' : ''
        }`}
        onClick={() => changeBasemap(POSITRON)}
      >
        <Tooltip placement='left' title='CARTO Positron' arrow>
          <img src='/basemaps/positron.jpg' alt='Positron basemap' />
        </Tooltip>
      </div>
      <div
        className={`${classes.basemapSelector} ${
          basemap === VOYAGER ? 'is-selected' : ''
        }`}
        onClick={() => changeBasemap(VOYAGER)}
      >
        <Tooltip placement='left' title='CARTO Voyager' arrow>
          <img src='/basemaps/voyager.jpg' alt='Voyager basemap' />
        </Tooltip>
      </div>
      <div
        className={`${classes.basemapSelector} ${
          basemap === DARK_MATTER ? 'is-selected' : ''
        }`}
        onClick={() => changeBasemap(DARK_MATTER)}
      >
        <Tooltip placement='left' title='CARTO Dark Matter' arrow>
          <img src='/basemaps/dark-matter.jpg' alt='Dark Matter basemap' />
        </Tooltip>
      </div>
      <div
        className={`${classes.basemapSelector} ${
          basemap === GOOGLE_ROADMAP ? 'is-selected' : ''
        }`}
        onClick={() => changeBasemap(GOOGLE_ROADMAP)}
      >
        <Tooltip placement='left' title='Google Map' arrow>
          <img src='/basemaps/google-map.jpg' alt='Google basemap' />
        </Tooltip>
      </div>
      <div
        className={`${classes.basemapSelector} ${
          basemap === GOOGLE_SATELLITE ? 'is-selected' : ''
        }`}
        onClick={() => changeBasemap(GOOGLE_SATELLITE)}
      >
        <Tooltip placement='left' title='Google Satellite' arrow>
          <img src='/basemaps/google-satellite.jpg' alt='Google satellite basemap' />
        </Tooltip>
      </div>
    </div>
  );
}

export default BasemapSelector;
