import React, { useMemo } from 'react';
import Styles from './Scene.module.css';
import {
  getNodeKey,
  GraphGrid,
  Node,
  NodeKey,
} from '../../dataStructures/pathFinder';

export interface SceneProps {
  graph: GraphGrid;
  size: { rows: number; cols: number };
  visited: Set<NodeKey>;
  walls: Set<NodeKey>;
  root?: Node;
  target?: Node;
}

export const Scene: React.FC<SceneProps> = ({
  graph,
  size,
  visited,
  walls,
  root,
  target,
}) => {
  const blocks = useMemo(() => {
    return graph
      .flat<GraphGrid>(1)
      .map(node => <div className={Styles.Block} key={getNodeKey(node)} />);
  }, [graph]);

  return (
    <div
      className={Styles.Scene}
      style={{
        ['--rows' as any]: size.rows,
        ['--cols' as any]: size.cols,
      }}
    >
      {blocks}
    </div>
  );
};
