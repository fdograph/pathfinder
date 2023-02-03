import React from 'react';
import { usePathFinderContext } from '../../utilities/PathFinderContext';

import Styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={Styles.header}>
      <div>
        <select>
          <option>Dijkstra</option>
        </select>
        <button>play</button>
        <button>stop</button>
      </div>
    </header>
  );
};
