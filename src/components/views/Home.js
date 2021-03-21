import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Viewer from './Viewer';
import { PROVIDERS, TYPES } from '../common/constants';

function Home() {
  const { provider, type } = useParams();

  if (PROVIDERS.indexOf(provider) === -1) {
    throw Error(`Unknowm provider ${provider}`);
  }

  if (TYPES.indexOf(type) === -1) {
    throw Error(`Unknowm type ${type}`);
  }

  const location = useLocation();
  const query = new URLSearchParams(location.search);

  return <Viewer provider={provider} type={type} query={query} />;
}

export default Home;
