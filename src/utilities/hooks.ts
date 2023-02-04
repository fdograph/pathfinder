import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
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
  const setSolved = useCallback((path: Node[]) => {
    setPath(path.map(getNodeKey));
    setIsSolved(true);
    setIsRunning(false);
  }, []);
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
      return;
    }

    console.log('Solving, ', {
      pathFinder,
      reset,
      root,
      setSolved,
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

      if (found) {
        setSolved(path);
        return;
      }
    }

    setUnsolved();
  }, [pathFinder, reset, root, setSolved, setUnsolved, target, walls]);

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
