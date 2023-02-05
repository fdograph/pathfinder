export interface Node {
  row: number;
  col: number;
}

export type NodeKey = `${number}:${number}`;

export type GraphGrid = Array<Array<Node>>;

export const buildGraphGrid = (
  rowCount: number,
  colCount: number
): GraphGrid => {
  const grid: GraphGrid = [];

  for (let row = 0; row < rowCount; row++) {
    const rowNodes = [];
    for (let col = 0; col < colCount; col++) {
      rowNodes.push({ row, col });
    }

    grid.push(rowNodes);
  }

  return grid;
};

export const getNode = ({ row, col }: Node, grid: GraphGrid) => {
  return grid[row] ? grid[row][col] : undefined;
};

export const getNodeKey = (node: Node): NodeKey => {
  return `${node.row}:${node.col}`;
};

export const getNodeCoords = (key: NodeKey): Node => {
  const [row, col] = key.split(':').map(Number);
  return { row, col };
};

export const hasEqualCoords = (a: Node, b: Node): boolean => {
  return a.row === b.row && a.col === b.col;
};

export const nodeExists = (node: Node | undefined): node is Node => {
  return node !== undefined;
};

export const getNeighbors = (node: Node, grid: GraphGrid) => {
  const top = getNode({ row: node.row - 1, col: node.col }, grid);
  const bottom = getNode({ row: node.row + 1, col: node.col }, grid);
  const left = getNode({ row: node.row, col: node.col - 1 }, grid);
  const right = getNode({ row: node.row, col: node.col + 1 }, grid);

  return [top, right, bottom, left].filter(nodeExists);
};

export const buildPathArray = (
  node: Node,
  family: Map<NodeKey, NodeKey>
): Node[] => {
  const list: Node[] = [node];
  let currentNode: Node | undefined = node;

  while (currentNode) {
    const currentNodeKey = getNodeKey(currentNode);
    const foundBy = family.get(currentNodeKey);

    if (foundBy === undefined) {
      break;
    }

    list.push(getNodeCoords(foundBy));
    currentNode = getNodeCoords(foundBy);
  }

  return list;
};

const getDistance = (a: Node, b: Node): number => {
  const yDiff = Math.abs(a.row - b.row);
  const xDiff = Math.abs(a.col - b.col);

  return Math.sqrt(Math.pow(yDiff, 2) + Math.pow(xDiff, 2));
};

export type HeuristicFn = (
  nodes: Node[],
  target: Node,
  root: Node,
  family: Map<NodeKey, NodeKey>
) => Node;

export const aStarHeuristic: HeuristicFn = (
  nodes: Node[],
  target: Node,
  root: Node,
  family: Map<NodeKey, NodeKey>
): Node => {
  let leastFactor = Infinity;
  let chosen = nodes[0];

  for (const node of nodes) {
    const distance = getDistance(node, target);
    const pathLength = buildPathArray(node, family).length;
    const nodeFactor = Math.log(distance * pathLength);

    if (nodeFactor < leastFactor) {
      leastFactor = nodeFactor;
      chosen = node;
    }
  }

  return chosen;
};

export const dijkstraHeuristic: HeuristicFn = (nodes: Node[]): Node => {
  return [...nodes].shift()!;
};

export type AlgoType = 'dijkstra' | 'astar';

export const getHeuristic = (type: AlgoType): HeuristicFn => {
  switch (type) {
    case 'astar':
      return aStarHeuristic;
    case 'dijkstra':
    default:
      return dijkstraHeuristic;
  }
};

export interface PathFinderSolverRound {
  node: Node;
  path: Node[];
  found: boolean;
}
export const pathFinderSearchGenerator = function* (
  type: AlgoType,
  root: Node,
  target: Node,
  grid: GraphGrid,
  walls: NodeKey[] = []
): Generator<PathFinderSolverRound, void> {
  const visited = new Set<NodeKey>();
  const invalid = new Set<NodeKey>(walls);
  const family = new Map<NodeKey, NodeKey>();
  const heuristic = getHeuristic(type);
  let queue: Node[] = [root];

  while (queue.length) {
    const node = heuristic(queue, target, root, family);
    const nodeKey = getNodeKey(node);

    // already saw this node
    if (visited.has(nodeKey)) {
      continue;
    }

    // target found
    if (hasEqualCoords(node, target)) {
      yield { node, path: buildPathArray(node, family), found: true };
      break;
    }

    const neighbors = getNeighbors(node, grid).filter(
      neighbor =>
        !visited.has(getNodeKey(neighbor)) &&
        !invalid.has(getNodeKey(neighbor)) &&
        !family.has(getNodeKey(neighbor))
    );

    neighbors.forEach(neighbor => {
      family.set(getNodeKey(neighbor), nodeKey);
    });

    visited.add(nodeKey);
    queue = [...queue.filter(n => !hasEqualCoords(n, node)), ...neighbors];

    yield { node, path: buildPathArray(node, family), found: false };
  }
};

export const aStarSearch = (
  root: Node,
  target: Node,
  grid: GraphGrid,
  walls: NodeKey[]
) => pathFinderSearchGenerator('astar', root, target, grid, walls);

export const dijkstraSearch = (
  root: Node,
  target: Node,
  grid: GraphGrid,
  walls: NodeKey[]
) => pathFinderSearchGenerator('dijkstra', root, target, grid, walls);

export const getPathFinderSolver = (
  type: AlgoType
): ((
  root: Node,
  target: Node,
  grid: GraphGrid,
  walls: NodeKey[]
) => Generator<{ node: Node; path: Node[]; found: boolean }, void>) => {
  switch (type) {
    case 'astar':
      return aStarSearch;
    case 'dijkstra':
    default:
      return dijkstraSearch;
  }
};
