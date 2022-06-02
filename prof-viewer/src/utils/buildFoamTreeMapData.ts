import Profile, {ProfileTask} from '../models/Profile';
import FoamTreeMapData, {FoamTreeMapGroup} from '../models/FoamTreeMapData';

export default function buildFoamTreeMapData(
  profile: Profile
): FoamTreeMapData {
  return {
    groups: profile.children?.map(parseRecursively) || [],
  };
}

function parseRecursively(task: ProfileTask): FoamTreeMapGroup {
  return {
    label: task.name,
    weight: task.duration_ns,
    groups: task.children?.map(parseRecursively),
  };
}
