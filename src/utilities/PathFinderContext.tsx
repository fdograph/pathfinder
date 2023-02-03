import React, { useCallback, useContext, useState } from 'react';
import {
  buildGraphGrid,
  dijkstraSearchGenerator,
  GraphGrid,
  Node,
} from '../dataStructures/pathFinder';
import { useOnResize } from './hooks';

const notImplemented = (...n: any) => {
  throw new Error('No PathFinderContextProvider found');
};

export type AlgoType = 'dijkstra';

export interface PathFinderContextProps {
  selectedAlgo: AlgoType;
  setSelectedAlgo: (t: AlgoType) => void;
  graph: GraphGrid;
  size: { cols: number; rows: number };

  setGraphSize: (rows: number, cols: number) => void;
  getSolver: (
    root: Node,
    target: Node
  ) => Generator<
    {
      node: Node;
      path: Node[];
      found: boolean;
    },
    void
  >;
}

const getPathFinderSolver = (
  type: AlgoType
): ((
  root: Node,
  target: Node,
  grid: GraphGrid
) => Generator<{ node: Node; path: Node[]; found: boolean }, void>) => {
  switch (type) {
    case 'dijkstra':
    default:
      return dijkstraSearchGenerator;
  }
};

export const PathFinderContext = React.createContext<PathFinderContextProps>({
  selectedAlgo: 'dijkstra',
  setSelectedAlgo: notImplemented,
  graph: [],
  size: { cols: 0, rows: 0 },
  setGraphSize: notImplemented,
  getSolver: notImplemented,
});

export const PathFinderContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgoType>('dijkstra');
  const [size, setSize] = useState({ cols: 0, rows: 0 });
  const [graph, setGraph] = useState<GraphGrid>([]);
  const setGraphSize = useCallback((rows: number, cols: number) => {
    setSize({ rows, cols });
    setGraph(buildGraphGrid(rows, cols));
  }, []);
  const getSolver = useCallback(
    (root: Node, target: Node) => {
      const solverFn = getPathFinderSolver(selectedAlgo);

      return solverFn(root, target, graph);
    },
    [graph, selectedAlgo]
  );

  const initialValue: PathFinderContextProps = {
    selectedAlgo,
    setSelectedAlgo,
    graph,
    setGraphSize,
    getSolver,
    size,
  };

  return (
    <PathFinderContext.Provider value={initialValue}>
      {children}
    </PathFinderContext.Provider>
  );
};

export const usePathFinderContext = () => useContext(PathFinderContext);

export const useResponsivePathFinder = (
  ref: React.RefObject<HTMLElement>,
  nodeSize: number = 40
) => {
  const context = usePathFinderContext();
  const resetGraph = useCallback(() => {
    const width = ref.current?.offsetWidth ?? 0;
    const height = ref.current?.offsetHeight ?? 0;

    const rows = Math.floor(height / nodeSize);
    const cols = Math.floor(width / nodeSize);

    console.log({ width, height, rows, cols });
    context.setGraphSize(rows, cols);
  }, [context, nodeSize, ref]);

  useOnResize(resetGraph);

  return context;
};
