import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.dialogWindow || initialState;

export const selectDialogWindow = createSelector(
  [selectDomain],
  dialogWindowState => dialogWindowState,
);
