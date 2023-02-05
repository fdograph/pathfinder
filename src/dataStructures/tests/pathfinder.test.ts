import { buildGraphGrid, dijkstraSearch, Node } from '../pathFinder';

describe('functionalPathFinder', () => {
  it('Should create a  graph of size according to given settings', () => {
    const graph = buildGraphGrid(10, 5);
    expect(graph.length).toEqual(10);

    graph.forEach(row => {
      expect(row.length).toEqual(5);
    });
  });

  it('Should return an ordered list of nodes representing the shortest path', () => {
    const graph = buildGraphGrid(10, 5);
    const solver = dijkstraSearch(
      { col: 1, row: 1 },
      { col: 4, row: 9 },
      graph,
      []
    );

    let result: Node[] = [];

    for (const round of solver) {
      if (round.found) {
        result = round.path;
      }
    }

    expect(result.length).not.toEqual(0);
    expect(result[0]).toEqual({ col: 4, row: 9 });
    expect(result[result.length - 1]).toEqual({ col: 1, row: 1 });
  });

  it('Should find the shortest path in steps', () => {
    // [+][-][-]
    // [-][-][-]
    // [-][-][*]
    const rootNodeCoords = { row: 0, col: 0 };
    const targetCoords = { row: 2, col: 2 };
    const graph = buildGraphGrid(3, 3);
    const solver = dijkstraSearch(rootNodeCoords, targetCoords, graph, []);

    const correctStepCoords = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 0, col: 2 },
      { row: 1, col: 1 },
      { row: 2, col: 0 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
    ];

    for (const { node, path, found } of solver) {
      const stepCoords = correctStepCoords.shift();
      expect({ ...node }).toEqual(stepCoords);

      if (found) {
        expect(path).toHaveLength(5);
      }
    }
  });
});
