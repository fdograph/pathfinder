import React from 'react';
import classNames from 'classnames';
import Styles from './Header.module.css';
import { usePathFinderContext } from '../../utilities/PathFinderContext';
import { AlgoType } from '../../dataStructures/pathFinder';

export interface HeaderProps {
  isRunning: boolean;
  solve: () => Promise<boolean>;
  stop: () => void;
  reset: () => void;
  clear: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isRunning,
  solve,
  stop,
  reset,
  clear,
}) => {
  const pathFinder = usePathFinderContext();

  return (
    <header className={Styles.Header}>
      <div className={Styles.FieldGroup}>
        <div className={Styles.FormFieldContainer}>
          <label className={Styles.AlgoSelector}>
            <span>Selected algorithm:</span>
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
          </label>
        </div>
      </div>
      <div className={Styles.FieldGroup}>
        {isRunning ? (
          <div className={Styles.FormFieldContainer}>
            <button
              className={classNames(Styles.Button, Styles.NegativeButton)}
              onClick={stop}
            >
              Stop
            </button>
          </div>
        ) : (
          <div className={Styles.FormFieldContainer}>
            <button
              className={classNames(Styles.Button, Styles.PositiveButton)}
              onClick={solve}
            >
              Solve
            </button>
          </div>
        )}

        <div className={Styles.FormFieldContainer}>
          <button
            className={classNames(Styles.Button, Styles.NeutralButton)}
            onClick={reset}
          >
            Reset
          </button>
        </div>
        <div className={Styles.FormFieldContainer}>
          <button
            className={classNames(Styles.Button, Styles.NegativeButton)}
            onClick={clear}
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};
