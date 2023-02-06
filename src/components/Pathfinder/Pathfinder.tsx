import React, { useCallback, useEffect, useRef, useState } from 'react';
import Styles from './Pathfinder.module.css';
import { Scene } from '../Scene/Scene';
import { useResponsivePathFinder } from '../../utilities/PathFinderContext';
import {
  getNodeCoords,
  getNodeKey,
  hasEqualCoords,
  Node,
  NodeKey,
} from '../../dataStructures/pathFinder';
import { usePathFinderSolver, useWalls } from '../../utilities/hooks';
import { Header } from '../Header/Header';

export const Pathfinder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathFinder = useResponsivePathFinder(containerRef);
  const { walls, removeWall, addWall, clearWalls, isWall } = useWalls();
  const {
    path,
    visited,
    isSolved,
    isRunning,
    stop,
    reset,
    solve,
    root,
    target,
    setRoot,
    setTarget,
  } = usePathFinderSolver(pathFinder, walls);
  const toggleType = useCallback(
    (node: Node) => {
      if (root === undefined && !(target && hasEqualCoords(node, target))) {
        setRoot(node);
        return;
      }

      if (target === undefined && !(root && hasEqualCoords(node, root))) {
        setTarget(node);
        return;
      }

      if (root && hasEqualCoords(node, root)) {
        setRoot(undefined);
        return;
      }

      if (target && hasEqualCoords(node, target)) {
        setTarget(undefined);
      }
    },
    [root, setRoot, setTarget, target]
  );
  const clearAll = useCallback(() => {
    stop();
    clearWalls();
    setRoot(undefined);
    setTarget(undefined);
    reset();
  }, [clearWalls, reset, setRoot, setTarget, stop]);
  const onEnterKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (isSolved && !isRunning) {
          reset();
        } else if (!isRunning) {
          solve().then(wasSolved => {
            console.log(
              wasSolved ? 'Graph Solved!!!! :D' : 'no solution found :('
            );
          });
        } else {
          console.log('Stopping');
          stop();
        }
      }
    },
    [isRunning, isSolved, reset, solve, stop]
  );
  const onClick = useCallback(
    (node: Node) => {
      toggleType(node);
    },
    [toggleType]
  );
  const [drawingMode, setDrawingMode] = useState<string | undefined>();
  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      const evTarget = event.target as HTMLElement;
      const nodeKey = evTarget.dataset.nodeKey as NodeKey;

      if (!root || !target || isRunning) {
        return;
      }

      reset().then(() => {
        const mode = isWall(nodeKey) ? 'delete' : 'add';
        setDrawingMode(mode);

        if (mode === 'delete') {
          removeWall(nodeKey);
        } else {
          addWall(nodeKey);
        }
      });
    },
    [addWall, isRunning, isWall, removeWall, reset, root, target]
  );
  const onPointerUp = useCallback((event: React.PointerEvent<HTMLElement>) => {
    setDrawingMode(undefined);
  }, []);
  const onPointerEnter = useCallback(
    (node: Node, event: React.PointerEvent<HTMLElement>) => {
      event.preventDefault();

      if (
        !drawingMode ||
        (root && hasEqualCoords(node, root)) ||
        (target && hasEqualCoords(node, target))
      ) {
        return;
      }

      const nodeKey = getNodeKey(node);

      if (drawingMode === 'delete') {
        removeWall(nodeKey);
      } else if (drawingMode === 'add') {
        addWall(nodeKey);
      }
    },
    [addWall, drawingMode, removeWall, root, target]
  );

  useEffect(() => {
    document.addEventListener('keyup', onEnterKey);

    return () => {
      document.removeEventListener('keyup', onEnterKey);
    };
  }, [onEnterKey]);

  return (
    <div className={Styles.Pathfinder}>
      <Header
        isRunning={isRunning}
        solve={solve}
        stop={stop}
        reset={reset}
        clear={clearAll}
      />
      <div className={Styles.SceneContainer} ref={containerRef}>
        <Scene
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerEnter={onPointerEnter}
          onClick={onClick}
          graph={pathFinder.graph}
          size={pathFinder.size}
          visited={visited}
          walls={walls}
          path={path}
          root={root}
          target={target}
        />
      </div>
    </div>
  );
};
