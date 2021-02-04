import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, Grid, Typography } from '@material-ui/core';
import background404 from '../../assets/img/404.svg';

const useStyles = makeStyles((theme) => ({
  containerWrapper: {
    flex: '1 1 auto',
    display: 'flex',
  },
  contentWrapper: {
    backgroundImage: `url("${background404}")`,
    backgroundPosition: 'bottom',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    height: '100%',
  },
  actionWrapper: {
    marginTop: '24px',
  },
}));

export default function NotFound() {
  const classes = useStyles();

  return (
    <Container className={classes.containerWrapper}>
      <Grid
        container
        direction='column'
        spacing={2}
        justify='center'
        alignContent='space-between'
        className={classes.contentWrapper}
      >
        <Grid item>
          <Typography variant='h5'>Error 404</Typography>
        </Grid>
        <Grid item>
          <Typography variant='h3'>
            Whoops!
            <br />
            You’re lost at sea
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant='body1'>
            The map you’re looking for doesn’t exist.
            <br />
            Use Location Intelligence to find your way home.
          </Typography>
        </Grid>
        <Grid item className={classes.actionWrapper}>
          <a href='https://carto.com/login'>
            <Button variant='contained' color='primary' size='large'>
              Take me home
            </Button>
          </a>
        </Grid>
      </Grid>
    </Container>
  );
}
