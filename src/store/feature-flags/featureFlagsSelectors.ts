import type { RootState } from 'store/rootReducer';

import { stateKey } from './featureFlagsReducer';

export const selectFeatureFlagsState = (state: RootState) => state[stateKey];

export const selectHasFeatureFlags = (state: RootState) => selectFeatureFlagsState(state).hasFeatureFlags;

export const selectIsDetailsFeatureEnabled = (state: RootState) =>
  selectFeatureFlagsState(state).isDetailsFeatureEnabled;
