import React, { useCallback, useRef, useState } from 'react';
import Styles from './Pathfinder.module.css';
import { Scene } from '../Scene/Scene';
import { useResponsivePathFinder } from '../../utilities/PathFinderContext';
import { getNodeKey, Node, NodeKey } from '../../dataStructures/pathFinder';
import { wait } from '../../utilities/hooks';

export const Pathfinder: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathFinder = useResponsivePathFinder(containerRef);
  const [visited, setVisited] = useState<Set<NodeKey>>(new Set());
  const [walls, setWalls] = useState<Set<NodeKey>>(new Set());
  const [root, setRoot] = useState<Node>();
  const [target, setTarget] = useState<Node>();

  const solve = useCallback(async () => {
    if (root === undefined || target === undefined) {
      console.log('root or target is undefined');
      return;
    }

    const solver = pathFinder.getSolver(root, target);
    for await (const { node } of solver) {
      await wait(1000);

      setVisited(new Set([...visited, getNodeKey(node)]));
    }
  }, [pathFinder, root, target, visited]);

  return (
    <div className={Styles.Pathfinder}>
      {/* <Header /> */}
      <div className={Styles.SceneContainer} ref={containerRef}>
        <Scene
          graph={pathFinder.graph}
          size={pathFinder.size}
          visited={visited}
          walls={walls}
          root={root}
          target={target}
        />
      </div>
    </div>
  );
};
