import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { TYPES } from 'utils/layerTypes';
import Viewer from './Viewer';

function Home() {
  const { username, type } = useParams();

  if (!username) {
    throw Error(`Unknowm type ${type}`);
  }

  if (type !== TYPES.SQL && type !== TYPES.BIGQUERY) {
    throw Error(`Unknowm type ${type}`);
  }

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return <Viewer username={username} type={type} query={query} />;
}

export default Home;
