import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { getNodeKey, Node, NodeKey } from '../dataStructures/pathFinder';
import { PathFinderContextProps } from './PathFinderContext';

export const wait = (time: number) =>
  new Promise((resolve, reject) => setTimeout(resolve, time));

export interface BlockDimensions {
  width: number;
  height: number;
}

export const useOnResize = (handler: () => void) => {
  const onResize = useCallback(() => {
    handler();
  }, [handler]);

  useLayoutEffect(() => {
    handler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return onResize;
};

export const useWindowSize = () => {
  const [size, setSize] = useState<BlockDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const onResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useOnResize(onResize);

  return size;
};

let HAND_BREAK = false;
const setHandBreak = (v: boolean) => {
  HAND_BREAK = v;
  return HAND_BREAK;
};

const checkHandBreak = () => HAND_BREAK;

export const useWalls = () => {
  const [wallsSet, setWallsSet] = useState<Set<NodeKey>>(new Set());
  const walls = useMemo(() => [...wallsSet], [wallsSet]);
  const addWall = useCallback(
    (key: NodeKey) => {
      const w = new Set([...walls, key]);
      setWallsSet(w);
    },
    [walls]
  );
  const removeWall = useCallback(
    (key: NodeKey) => {
      const w = new Set(walls);

      w.delete(key);
      setWallsSet(w);
    },
    [walls]
  );

  const isWall = useCallback((key: NodeKey) => wallsSet.has(key), [wallsSet]);

  return { walls, addWall, removeWall, isWall };
};

export const usePathFinderSolver = (
  pathFinder: PathFinderContextProps,
  root?: Node,
  target?: Node,
  walls?: NodeKey[]
) => {
  const [path, setPath] = useState<NodeKey[]>([]);
  const [visited, setVisited] = useState<NodeKey[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const stop = useCallback(() => {
    if (isRunning) {
      setHandBreak(true);
    }
  }, [isRunning]);
  const setUnsolved = useCallback(() => {
    setPath([]);
    setIsRunning(false);
    setHandBreak(false);
    setIsSolved(false);
  }, []);
  const reset = useCallback(() => {
    setVisited([]);
    setUnsolved();
  }, [setUnsolved]);
  const solve = useCallback(async () => {
    if (root === undefined || target === undefined) {
      console.log('root or target is undefined');
      return false;
    }

    console.log('Solving, ', {
      pathFinder,
      reset,
      root,
      setUnsolved,
      target,
      walls,
    });
    setIsRunning(true);

    const solver = pathFinder.getSolver(root, target, walls ?? []);
    const updatedVisited = new Set<NodeKey>();
    for await (const { node, path, found } of solver) {
      if (checkHandBreak()) {
        console.log('Hand Break activated, resetting');
        reset();
        break;
      }

      await wait(0);

      updatedVisited.add(getNodeKey(node));
      setVisited([...updatedVisited]);

      setPath(path.map(getNodeKey));

      if (found) {
        setIsSolved(true);
        setIsRunning(false);

        return true;
      }
    }

    setUnsolved();
    return false;
  }, [pathFinder, reset, root, setUnsolved, target, walls]);

  return {
    path,
    visited,
    isSolved,
    isRunning,
    stop,
    reset,
    solve,
  };
};
