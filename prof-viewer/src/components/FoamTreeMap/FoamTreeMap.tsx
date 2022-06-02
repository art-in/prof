import React, {useCallback, useEffect, useRef} from 'react';
// eslint-disable-next-line
// @ts-ignore because the lib doesn't provide typings
import FoamTree from '@carrotsearch/foamtree';
import classes from './FoamTreeMap.module.css';
import FoamTreeMapData from '../../models/FoamTreeMapData';

interface Props {
  data: FoamTreeMapData;
}

export default function FoamTreeMap(props: Props) {
  const elementRef = useRef<HTMLDivElement>(null);

  const treeRef = useRef<Record<string, unknown> | null>(null);

  const onWindowResize = useCallback(() => {
    if (treeRef.current) {
      // eslint-disable-next-line
      // @ts-ignore
      treeRef.current.resize();
    }
  }, []);

  useEffect(() => {
    if (!FoamTree.supported) {
      alert("FoamTree doesn't support this browser");
    }

    // API reference: https://get.carrotsearch.com/foamtree/latest/api/
    treeRef.current = new FoamTree({
      element: elementRef.current,
      layout: 'squarified',
      stacking: 'flattened',
      pixelRatio: window.devicePixelRatio || 1,
      groupMinDiameter: 0,
      rolloutDuration: 0,
      pullbackDuration: 0,
      fadeDuration: 0,
      groupExposureZoomMargin: 0.2,
      zoomMouseWheelDuration: 300,
      openCloseDuration: 200,
      dataObject: props.data,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, [onWindowResize]);

  return <div className={classes.root} ref={elementRef} />;
}
