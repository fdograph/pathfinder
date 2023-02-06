import React from 'react';
import Styles from './App.module.css';
import { Pathfinder } from './components/Pathfinder/Pathfinder';

export const App: React.FC = () => {
  return (
    <div data-testid="app" className={Styles.App}>
      <Pathfinder />
    </div>
  );
};
