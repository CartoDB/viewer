import React, { useState } from 'react';
import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import ConfigurationSidebar from './ConfigurationSidebar';
import ShareSidebar from './ShareSidebar';

import { ReactComponent as CartoMarker } from '../../../icons/carto-marker.svg';
import { ReactComponent as CloseIcon } from '../../../icons/close-icon.svg';
import { ReactComponent as SettingsIcon } from '../../../icons/settings-icon.svg';
import { ReactComponent as ShareIcon } from '../../../icons/share-icon.svg';

const useStyles = makeStyles((theme) => ({
  sidebarContainer: {
    maxWidth: '100vw',
    display: 'flex',
  },
  sidebar: {
    height: '100%',
    width: '56px',
    backgroundColor: '#036FE2',
  },
  sidebarElement: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '36px',
    height: '36px',
    margin: '16px auto',
    borderRadius: '4px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(44, 48, 50, 0.40)',
    },
    '&.is-selected': {
      backgroundColor: 'rgba(44, 48, 50, 0.40)',
    },
  },
  sidebarElementLogo: {
    width: '100%',
    height: 'auto',
    margin: '0',
    padding: '16px 0',
    cursor: 'default',
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
}));

function Sidebar(props) {
  const { type, shareOptions } = props;
  const [configurationSidebarOpen, setConfigurationSidebarOpen] = useState(false);
  const [shareSidebarOpen, setShareSidebarOpen] = useState(false);
  const classes = useStyles();

  const closeConfigurationSidebar = () => {
    props.onMenuCloses();
    setConfigurationSidebarOpen(false);
  };

  const openConfigurationSidebar = () => {
    closeShareSidebar();
    setConfigurationSidebarOpen(true);
  };

  const closeShareSidebar = () => {
    props.onMenuCloses();
    setShareSidebarOpen(false);
  };

  const openShareSidebar = () => {
    closeConfigurationSidebar();
    setShareSidebarOpen(true);
  };

  const closeAllMenus = () => {
    closeConfigurationSidebar();
    closeShareSidebar();
  };

  const backButton = props.goBackFunction ? (
    <Tooltip placement='right' title='Back to your tilesets' arrow>
      <div onClick={props.goBackFunction} style={{ cursor: 'pointer' }}>
        <CartoMarker />
      </div>
    </Tooltip>
  ) : (
    <CartoMarker />
  );

  return (
    <div className={classes.sidebarContainer}>
      <div className={classes.sidebar}>
        <div className={`${classes.sidebarElement} ${classes.sidebarElementLogo}`}>
          {configurationSidebarOpen || shareSidebarOpen ? (
            <IconButton onClick={closeAllMenus}>
              <CloseIcon />
            </IconButton>
          ) : (
            backButton
          )}
        </div>
        <div
          className={`${classes.sidebarElement} ${
            configurationSidebarOpen ? 'is-selected' : ''
          }`}
          onClick={openConfigurationSidebar}
        >
          <SettingsIcon />
        </div>
        <div
          className={`${classes.sidebarElement} ${shareSidebarOpen ? 'is-selected' : ''}`}
          onClick={openShareSidebar}
        >
          <ShareIcon />
        </div>
      </div>
      {configurationSidebarOpen && (
        <ConfigurationSidebar
          onBasemapChange={props.onBasemapChange}
          onStyleChange={props.onStyleChange}
          json={props.json}
          onJsonUpdated={props.onJsonUpdated}
          onClose={closeConfigurationSidebar}
          currentJson={props.jsonMap}
        />
      )}
      {shareSidebarOpen && (
        <ShareSidebar
          json={props.jsonMap}
          type={type}
          shareOptions={shareOptions}
          onClose={closeShareSidebar}
        />
      )}
    </div>
  );
}

export default Sidebar;
