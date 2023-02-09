import { PathFinderContextProvider } from '../utilities/PathFinderContext';
import React from 'react';

export const renderWithContexts = (component: React.ReactNode) => {
  return <PathFinderContextProvider>{component}</PathFinderContextProvider>;
};
