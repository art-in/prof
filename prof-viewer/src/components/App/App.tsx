import React, {useCallback, useState} from 'react';
import Profile from '../../models/Profile';
import State from '../../models/State';
import ViewMode from '../../models/ViewMode';
import ProfileInput from '../ProfileInput';
import ViewModeSelector from '../ViewModeSelector';
import TreeMap from '../TreeMap';
import FoamTreeMap from '../FoamTreeMap';
import classes from './App.module.css';

function App() {
  const [state, setState] = useState<State>({
    viewMode: ViewMode.TreeMap,
  });

  const onViewModeChange = useCallback(
    (viewMode: ViewMode) => {
      setState({
        ...state,
        viewMode,
      });
    },
    [state]
  );

  const onProfileSelected = useCallback(
    (contents: string) => {
      // TODO(artin): validate profile input format
      const profile = contents ? (JSON.parse(contents) as Profile) : undefined;
      setState({
        ...state,
        profile,
      });
    },
    [state]
  );

  let viewComponent: JSX.Element;

  if (state.profile) {
    switch (state.viewMode) {
      case ViewMode.TreeMap:
        viewComponent = <TreeMap profile={state.profile} />;
        break;
      case ViewMode.FoamTreeMap:
        viewComponent = <FoamTreeMap profile={state.profile} />;
        break;
      default:
        throw Error('Unknown view mode');
    }
  } else {
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
