import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.activityMap || initialState;

export const selectActivityMap = createSelector(
  [selectDomain],
  activityMapState => activityMapState,
);

export const selectLoading = createSelector(
  [selectDomain],
  activityMapState => activityMapState.loading,
);

export const selectDataset = createSelector(
  [selectDomain],
  activityMapState => activityMapState.activityData,
);

export const selectYear = createSelector(
  [selectDomain],
  activityMapState => activityMapState.year,
);
