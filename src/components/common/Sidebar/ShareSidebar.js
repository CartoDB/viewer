import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  makeStyles,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  Checkbox,
  TextField,
  Tooltip,
  Typography,
  Box,
  Button,
} from '@material-ui/core';

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { ReactComponent as CopyIcon } from '../../../icons/copyIcon.svg';
import { ReactComponent as CopyIconRed } from '../../../icons/copyIconRed.svg';
import { ReactComponent as QuestionIcon } from '../../../icons/questionIcon.svg';
import { ReactComponent as LinkIcon } from '../../../icons/linkIcon.svg';
import { ReactComponent as TwitterIcon } from '../../../icons/twitterIcon.svg';
import { ReactComponent as LinkedinIcon } from '../../../icons/linkedinIcon.svg';
import { ReactComponent as FbIcon } from '../../../icons/fbIcon.svg';
import cartoFullLogo from '../../../icons/carto-full-logo.svg';

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
  regular: {
    'font-weight': theme.typography.fontWeightRegular,
    '& strong': {
      'font-weight': theme.typography.fontWeightBold,
    },
  },
  infoIcon: {
    color: theme.palette.info.main,
  },
  txtError: {
    color: theme.palette.error.relatedDark,
    '& a': {
      color: theme.palette.error.relatedDark,
      'font-weight': theme.typography.fontWeightBold,
    },
  },
  textFieldError: {
    'border-radius': '4px',
    'background-color': 'rgba(255, 255, 255, 0.4)',
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      color: theme.palette.error.dark,
      'font-family': 'Overpass Mono',
      'font-size': '12px',
    },
  },
}));

function ShareSidebar(props) {
  const { username, type, shareOptions } = props;
  const [sharingMenu, setSharingMenu] = useState(false);
  const [showPrivacyMoreInfo, setShowPrivacyMoreInfo] = useState(false);
  const [showPrivacyError, setShowPrivacyError] = useState(false);
  const [privacyErrorStatus, setPrivacyErrorStatus] = useState();
  const [privacyErrorServerText, setPrivacyErrorServerText] = useState();
  const [isPublic, setisPublic] = useState(
    props.shareOptions && props.shareOptions.privacy === 'public'
  );
  const [privacySwithValue, setPrivacySwithValue] = useState(isPublic);
  const embeddedMode = props.shareOptions !== undefined;

  const classes = useStyles();

  const urlShareRef = useRef();
  const embedCodeRef = useRef();
  const serverErrorRef = useRef();
  const viewState = useSelector((state) => state.carto.viewState);

  const json = JSON.parse(JSON.stringify(props.json));

  if (embeddedMode) {
    json.layers.map((l) => {
      l.credentials.apiKey = 'default_public';
      return l;
    });
  }

  const baseUrl = () => {
    if (viewState) json.initialViewState = { ...viewState };

    Object.keys(json.initialViewState).forEach((k) => {
      const type = typeof viewState[k];
      if (type === 'object' || type === 'function') {
        delete json.initialViewState[k];
      }
    });
    const config = encodeURIComponent(btoa(JSON.stringify(json, null, 0)));

    if (embeddedMode) {
      return `${shareOptions.baseUrl}/user/${username}/${type}?config=${config}`;
    } else {
      const { origin, pathname } = window.location;
      return `${origin + pathname}?config=${config}`;
    }
  };

  const shareUrl = (showMenu) => {
    let url = baseUrl();
    if (!showMenu) {
      url = url + '&embed=true';
    }
    return url;
  };

  const iframeCode = () => {
    var url = baseUrl();
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
    const mapUrl = shareUrl(sharingMenu).replace('localhost:3001', 'viewer.carto.com');
    const tweetUrl = `${url}?url=${encodeURIComponent(mapUrl)}`;
    return tweetUrl;
  };

  const facebookUrl = () => {
    const url = 'https://www.facebook.com/sharer/sharer.php';
    const mapUrl = shareUrl(sharingMenu);
    const fbUrl = `${url}?u=${encodeURIComponent(mapUrl)}`;
    return fbUrl;
  };

  const linkedinUrl = () => {
    const url = 'http://www.linkedin.com/shareArticle?mini=true';
    const mapUrl = shareUrl(sharingMenu).replace('localhost:3001', 'viewer.carto.com');
    const linkedinUrl = `${url}&url=${encodeURIComponent(mapUrl)}`;
    return linkedinUrl;
  };

  const toggleShowMenu = (e) => {
    setSharingMenu(e.target.checked);
  };

  const togglePrivacyMoreInfo = () => {
    setShowPrivacyMoreInfo(!showPrivacyMoreInfo);
  };

  const togglePrivacy = async (e) => {
    const checked = e.target.checked;
    const privacy = checked ? 'public' : 'private';
    setPrivacySwithValue(checked);
    if (props.shareOptions && props.shareOptions.setPrivacy) {
      try {
        await props.shareOptions.setPrivacy(privacy);
        setisPublic(checked);
      } catch (error) {
        const { status, errors } = JSON.parse(error.message);
        setPrivacyErrorStatus(status);
        setPrivacyErrorServerText(errors);
        setShowPrivacyError(true);
      }
    }
  };

  return (
    <div className='configuration-sidebar'>
      <Box m={2} ml={3} display='flex' justifyContent='space-between'>
        <img className={classes.cartoLogo} src={cartoFullLogo} alt='CARTO' />
        <Typography className={classes.appName} variant='caption' color='textPrimary'>
          Map Viewer
        </Typography>
      </Box>
      <Divider />

      {embeddedMode && (
        <div>
          <Box m={2} ml={3} display='flex' justifyContent='space-between'>
            <Typography variant='h6' color='textPrimary'>
              Privacy
            </Typography>
          </Box>
          <Box m={2} ml={3} mt={0} display='flex' justifyContent='space-between'>
            <FormControlLabel
              control={<Switch />}
              label='Publish this map'
              onChange={togglePrivacy}
              checked={privacySwithValue}
            />
            <Button
              variant='text'
              color='primary'
              size='small'
              onClick={togglePrivacyMoreInfo}
            >
              More info
            </Button>
          </Box>
        </div>
      )}
      {showPrivacyMoreInfo && (
        <Box
          m={2}
          ml={3}
          mt={0}
          mb={3}
          p={2}
          bgcolor='background.default'
          borderRadius='4px'
        >
          <Typography
            component='p'
            mt={1}
            variant='caption'
            color='textSecondary'
            className={classes.regular}
          >
            By publishing this tileset, we'll grant <strong>BigQuery Data Viewer</strong>{' '}
            permission to the <strong>CARTO Maps API Service Account.</strong> This action
            will enable the public sharing links and allow visualizations from
            unauthenticated users.<br></br>
            <br></br>By unpublishing the tileset, we'll revoke the permission mentioned
            above and disable the sharing links.
          </Typography>
        </Box>
      )}
      {showPrivacyError && (
        <Box
          m={2}
          ml={3}
          mt={0}
          mb={3}
          p={2}
          bgcolor='error.relatedLight'
          borderRadius='4px'
          display='flex'
        >
          <InfoOutlinedIcon color='error' />
          <Box ml={1}>
            {privacyErrorStatus === 401 || privacyErrorStatus === 403 ? (
              <Typography
                component='p'
                variant='caption'
                className={`${classes.txtError} ${classes.regular}`}
              >
                There seems to be a problem with the service account provided. It might be
                missing required permissions. Please check the{' '}
                <a
                  href='https://docs.carto.com/spatial-extension-bq/overview/#usage-limits'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  documentation
                </a>{' '}
                to ensure you have provided them. If you keep getting this error, please
                contact us and provide the error info below.
              </Typography>
            ) : (
              <Typography
                component='p'
                variant='caption'
                className={`${classes.txtError} ${classes.regular}`}
              >
                There has been an error while connecting to BigQuery. Try again later and{' '}
                <a href='mailto:support@carto.com'>contact support</a> if the error
                persists.
              </Typography>
            )}
            <Box mt={2}>
              <Typography variant='caption' component='p' className={classes.txtError}>
                Error info
              </Typography>
              <Box display='flex' mt={1}>
                <TextField
                  className={classes.textFieldError}
                  variant='outlined'
                  size='small'
                  inputRef={serverErrorRef}
                  InputProps={{ readOnly: true }}
                  value={privacyErrorServerText}
                />
                <Box ml={1}>
                  <IconButton onClick={(e) => copyTextarea(e, serverErrorRef)}>
                    <CopyIconRed />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {embeddedMode && <Divider />}

      <Box mt={3} ml={3} display='flex' justifyContent='space-between'>
        <Typography variant='h6' color='textPrimary'>
          Sharing options
        </Typography>
      </Box>
      {!isPublic && embeddedMode && (
        <Box
          m={2}
          pl='18px'
          pt='13px'
          pb='13px'
          bgcolor='info.relatedLight'
          borderRadius='4px'
          display='flex'
          alignItems='center'
        >
          <Box mr={1} display='flex' alignItems='center'>
            <InfoOutlinedIcon className={classes.infoIcon} />
          </Box>
          <Typography variant='caption' className={classes.regular}>
            Publish the map to activate sharing options
          </Typography>
        </Box>
      )}
      {(isPublic || !embeddedMode) && (
        <Box m={2} ml={3} mt={3}>
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
                control={<Checkbox />}
                label='Enable menu and editor'
                onChange={toggleShowMenu}
              />
            </Box>
            <TextField
              className={classes.hiddenElement}
              variant='outlined'
              size='small'
              inputRef={urlShareRef}
              value={shareUrl(sharingMenu)}
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
                <div>
                  {/* Parent div required to prevent errors */}
                  <QuestionIcon />
                </div>
              </Tooltip>
            </Box>
          </Box>
          <Box display='flex' mt={2}>
            <TextField
              variant='outlined'
              size='small'
              inputRef={embedCodeRef}
              InputProps={{ readOnly: true }}
              value={iframeCode()}
            />
            <Box ml={1}>
              <IconButton onClick={(e) => copyTextarea(e, embedCodeRef)}>
                <CopyIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default ShareSidebar;
