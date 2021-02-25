import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Viewer from './Viewer';
import { CONNECTIONS, TYPES } from '../common/constants';

function Home() {
  const { username, connection, type } = useParams();

  if (!username) {
    throw Error(`Unknowm type ${type}`);
  }

  if (CONNECTIONS.indexOf(connection) === -1) {
    throw Error(`Unknowm connection ${connection}`);
  }

  if (TYPES.indexOf(type) === -1) {
    throw Error(`Unknowm type ${type}`);
  }

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return <Viewer username={username} connection={connection} type={type} query={query} />;
}

export default Home;
