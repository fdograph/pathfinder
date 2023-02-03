import { useCallback, useLayoutEffect, useState } from 'react';

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
