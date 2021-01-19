import React from 'react';
import { useRoutes } from 'react-router-dom';

import {
  createMuiTheme,
  CssBaseline,
  Grid,
  makeStyles,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core';

import { cartoThemeOptions } from '@carto/react/ui';

import routes from './routes';
import './App.css';
import Viewer from './components/views/Viewer';

let theme = createMuiTheme(cartoThemeOptions);
theme = responsiveFontSizes(theme, {
  breakpoints: cartoThemeOptions.breakpoints.keys,
  disableAlign: false,
  factor: 2,
  variants: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'button',
    'caption',
    'overline',
  ],
});

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
  },
}));

function App(props) {
  const classes = useStyles();
  const routing = useRoutes(routes);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid container direction='column' className={classes.root}>
        {Object.keys(props).length === 0 ? routing : <Viewer {...props} />}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
