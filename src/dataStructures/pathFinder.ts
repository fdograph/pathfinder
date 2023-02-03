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

export const dijkstraSearchGenerator = function* (
  root: Node,
  target: Node,
  grid: GraphGrid
): Generator<
  {
    node: Node;
    path: Node[];
    found: boolean;
  },
  void
> {
  const visited = new Set<NodeKey>();
  const family = new Map<NodeKey, NodeKey>();
  let queue: Node[] = [root];

  while (queue.length) {
    const node = queue.shift()!;
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
        !visited.has(getNodeKey(neighbor)) && !family.has(getNodeKey(neighbor))
    );

    neighbors.forEach(neighbor => {
      family.set(getNodeKey(neighbor), nodeKey);
    });

    visited.add(nodeKey);
    queue = [...queue, ...neighbors];

    yield { node, path: [], found: false };
  }
};

export const dijkstraSearch = (root: Node, target: Node, grid: GraphGrid) => {
  for (const { path, found } of dijkstraSearchGenerator(root, target, grid)) {
    if (found) {
      return path;
    }
  }

  return [];
};
