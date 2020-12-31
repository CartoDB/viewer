import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Box,
} from '@material-ui/core';

import { ReactComponent as CopyIcon } from '../../../icons/copyIcon.svg';
import { ReactComponent as QuestionIcon } from '../../../icons/questionIcon.svg';
import { ReactComponent as LinkIcon } from '../../../icons/linkIcon.svg';
import { ReactComponent as TwitterIcon } from '../../../icons/twitterIcon.svg';
import { ReactComponent as LinkedinIcon } from '../../../icons/linkedinIcon.svg';
import { ReactComponent as FbIcon } from '../../../icons/fbIcon.svg';

const useStyles = makeStyles((theme) => ({
  cartoLogo: {
    height: '24px',
  },
  appName: {
    textTransform: 'uppercase',
    opacity: '0.6',
  },
  hiddenElement: {
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  },
}));

function ShareSidebar(props) {
  const [sharingMenu, setSharingMenu] = useState(false);

  const classes = useStyles();

  const urlShareRef = useRef();
  const embedCodeRef = useRef();
  const viewState = useSelector((state) => state.carto.viewState);

  const baseUrl = (json) => {
    const { origin, pathname } = window.location;

    if (viewState) json.initialViewState = { ...viewState };
    const config = encodeURIComponent(btoa(JSON.stringify(json, null, 0)));
    return `${origin + pathname}?config=${config}`;
  };

  const shareUrl = (json, showMenu) => {
    let url = baseUrl(json);
    if (!showMenu) {
      url = url + '&embed=true';
    }
    return url;
  };

  const iframeCode = (json) => {
    var url = baseUrl(json);
    var iframeUrl = `<iframe src="${url}&embed=true" title="Deck.gl Playground"/>`;
    return iframeUrl;
  };

  const copyTextarea = (e, reference) => {
    reference.current.select();
    document.execCommand('copy');
    e.target.focus();
  };

  const twitterUrl = () => {
    const url = 'https://twitter.com/intent/tweet';
    const mapUrl = shareUrl(props.json, sharingMenu).replace(
      'localhost:3001',
      'viewer.carto.com'
    );
    const tweetUrl = `${url}?url=${encodeURIComponent(mapUrl)}`;
    return tweetUrl;
  };

  const facebookUrl = () => {
    const url = 'https://www.facebook.com/sharer/sharer.php';
    const mapUrl = shareUrl(props.json, sharingMenu);
    const fbUrl = `${url}?u=${encodeURIComponent(mapUrl)}`;
    return fbUrl;
  };

  const linkedinUrl = () => {
    const url = 'http://www.linkedin.com/shareArticle?mini=true';
    const mapUrl = shareUrl(props.json, sharingMenu).replace(
      'localhost:3001',
      'viewer.carto.com'
    );
    const linkedinUrl = `${url}&url=${encodeURIComponent(mapUrl)}`;
    return linkedinUrl;
  };

  const toggleShowMenu = (e) => {
    setSharingMenu(e.target.checked);
  };

  return (
    <div className='configuration-sidebar'>
      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <img className={classes.cartoLogo} src='/icons/carto-full-logo.svg' alt='CARTO' />
        <Typography className={classes.appName} variant='caption' color='textPrimary'>
          Map Viewer
        </Typography>
      </Box>
      <Divider />

      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <Typography variant='h6' color='textPrimary'>
          Share map
        </Typography>
      </Box>
      <Box m={2} ml={3} mt={1}>
        <Box mb={2}>
          <Typography variant='subtitle1' color='textPrimary'>
            Link
          </Typography>
          <Box mt={2} display='flex' alignItems='center'>
            <Box>
              <Tooltip placement='top' title='Copy link' arrow>
                <IconButton onClick={(e) => copyTextarea(e, urlShareRef)}>
                  <LinkIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box ml={1}>
              <Tooltip placement='top' title='Share on Twitter' arrow>
                <a href={twitterUrl()} target='_blank' rel='noopener noreferrer'>
                  <IconButton>
                    <TwitterIcon />
                  </IconButton>
                </a>
              </Tooltip>
            </Box>
            <Box ml={1}>
              <Tooltip placement='top' title='Share on Facebook' arrow>
                <a href={facebookUrl()} target='_blank' rel='noopener noreferrer'>
                  <IconButton>
                    <FbIcon />
                  </IconButton>
                </a>
              </Tooltip>
            </Box>
            <Box ml={1}>
              <Tooltip placement='top' title='Share on Linkedin' arrow>
                <a href={linkedinUrl()} target='_blank' rel='noopener noreferrer'>
                  <IconButton>
                    <LinkedinIcon />
                  </IconButton>
                </a>
              </Tooltip>
            </Box>
          </Box>
          <Box mt={1} ml={1}>
            <FormControlLabel
              control={<Switch />}
              label='Include menu and editor'
              onChange={toggleShowMenu}
            />
          </Box>
          <TextField
            className={classes.hiddenElement}
            variant='outlined'
            size='small'
            inputRef={urlShareRef}
            value={shareUrl(props.json, sharingMenu)}
          />
        </Box>
        <Divider />

        <Box display='flex' mt={3}>
          <Typography variant='subtitle1' color='textPrimary'>
            Embed this map
          </Typography>
          <Box ml={1}>
            <Tooltip
              placement='top'
              title='Copy and paste this HTML code into documents to embed this map on web pages.'
              arrow
            >
              <QuestionIcon />
            </Tooltip>
          </Box>
        </Box>
        <Box display='flex' mt={2}>
          <TextField
            variant='outlined'
            size='small'
            inputRef={embedCodeRef}
            InputProps={{ readOnly: true }}
            value={iframeCode(props.json)}
          />
          <Box ml={1}>
            <IconButton onClick={(e) => copyTextarea(e, embedCodeRef)}>
              <CopyIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default ShareSidebar;
