import React from 'react';

import Styles from './Header.module.css';
import { usePathFinderContext } from '../../utilities/PathFinderContext';
import { AlgoType } from '../../dataStructures/pathFinder';

export interface HeaderProps {
  solve: () => Promise<boolean>;
  stop: () => void;
  reset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ solve, stop, reset }) => {
  const pathFinder = usePathFinderContext();

  return (
    <header className={Styles.header}>
      <div>
        <select
          defaultValue={pathFinder.selectedAlgo}
          onChange={({ currentTarget: { value } }) => {
            stop();
            reset();
            pathFinder.setSelectedAlgo(value as AlgoType);
          }}
        >
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
        </select>
        <button onClick={solve}>solve</button>
        <button onClick={stop}>stop</button>
        <button onClick={reset}>reset</button>
      </div>
    </header>
  );
};
