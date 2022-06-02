import Profile from './Profile';
import ViewMode from './ViewMode';
import ViewData from './ViewData';

export default interface State {
  profile?: Profile;
  viewMode: ViewMode;
  viewData?: ViewData;
}
