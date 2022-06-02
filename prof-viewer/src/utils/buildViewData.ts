import Profile from '../models/Profile';
import ViewData from '../models/ViewData';
import ViewMode from '../models/ViewMode';
import buildFoamTreeMapData from './buildFoamTreeMapData';
import buildTreeMapData from './buildTreeMapData';

export default function buildViewData(
  profile: Profile,
  viewMode: ViewMode
): ViewData {
  switch (viewMode) {
    case ViewMode.TreeMap:
      return {
        viewMode: ViewMode.TreeMap,
        data: buildTreeMapData(profile),
      };
    case ViewMode.FoamTreeMap:
      return {
        viewMode: ViewMode.FoamTreeMap,
        data: buildFoamTreeMapData(profile),
      };
    default:
      throw Error('Unknown view mode');
  }
}
