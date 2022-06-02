import React, {useCallback, useState} from 'react';
import Profile from '../../models/Profile';
import State from '../../models/State';
import ViewMode from '../../models/ViewMode';
import buildViewData from '../../utils/buildViewData';
import ProfileInput from '../ProfileInput';
import ViewModeSelector from '../ViewModeSelector';
import TreeMap from '../TreeMap';
import FoamTreeMap from '../FoamTreeMap';
import classes from './App.module.css';

function App() {
  const [state, setState] = useState<State>({
    viewMode: ViewMode.FoamTreeMap,
  });

  const onViewModeChange = useCallback(
    (viewMode: ViewMode) => {
      setState({
        ...state,
        viewMode,
        viewData: state.profile
          ? buildViewData(state.profile, viewMode)
          : undefined,
      });
    },
    [state]
  );

  const onProfileSelected = useCallback(
    (contents: string) => {
      // TODO(artin): validate input format
      const profile = contents ? (JSON.parse(contents) as Profile) : undefined;
      setState({
        ...state,
        profile,
        viewData: profile ? buildViewData(profile, state.viewMode) : undefined,
      });
    },
    [state]
  );

  let viewComponent: JSX.Element;

  switch (state.viewData?.viewMode) {
    case ViewMode.TreeMap:
      viewComponent = <TreeMap />;
      break;
    case ViewMode.FoamTreeMap:
      viewComponent = <FoamTreeMap data={state.viewData.data} />;
      break;
    default:
      viewComponent = (
        <div className={classes.noprofile}>No profile selected</div>
      );
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <ProfileInput onProfileSelected={onProfileSelected} />
        <ViewModeSelector
          viewMode={state.viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
      <div className={classes.view}>{viewComponent}</div>
    </div>
  );
}

export default App;
