import React, { useMemo } from 'react';
import Styles from './Scene.module.css';
import {
  getNodeKey,
  GraphGrid,
  hasEqualCoords,
  Node,
  NodeKey,
} from '../../dataStructures/pathFinder';
import classNames from 'classnames';

export interface SceneProps {
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerEnter: (node: Node, event: React.PointerEvent<HTMLElement>) => void;
  onClick: (node: Node) => void;
  graph: GraphGrid;
  size: { rows: number; cols: number };
  visited: NodeKey[];
  path: NodeKey[];
  walls: NodeKey[];
  root?: Node;
  target?: Node;
}

export const Scene: React.FC<SceneProps> = ({
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onClick,
  graph,
  size,
  visited,
  path,
  walls,
  root,
  target,
}) => {
  const blocks = useMemo(() => {
    return graph.flat<GraphGrid>(1).map(node => (
      <div
        key={getNodeKey(node)}
        onClick={() => onClick(node)}
        onPointerEnter={event => onPointerEnter(node, event)}
        className={classNames(Styles.Block, {
          [Styles.Visited]: visited.indexOf(getNodeKey(node)) > -1,
          [Styles.Wall]: walls.indexOf(getNodeKey(node)) > -1,
          [Styles.Root]: root && hasEqualCoords(node, root),
          [Styles.Target]: target && hasEqualCoords(node, target),
          [Styles.Path]: path.indexOf(getNodeKey(node)) > -1,
        })}
        data-node-key={getNodeKey(node)}
      />
    ));
  }, [graph, onClick, onPointerEnter, path, root, target, visited, walls]);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
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
