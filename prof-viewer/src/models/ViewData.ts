import FoamTreeMapData from './FoamTreeMapData';
import TreeMapData from './TreeMapData';
import ViewMode from './ViewMode';

interface TreeMapViewData {
  viewMode: ViewMode.TreeMap;
  data: TreeMapData;
}

interface FoamTreeMapViewData {
  viewMode: ViewMode.FoamTreeMap;
  data: FoamTreeMapData;
}

type ViewData = TreeMapViewData | FoamTreeMapViewData;

export default ViewData;
