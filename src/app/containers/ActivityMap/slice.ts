import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ActivityMap container
export const initialState: ContainerState = {
  activityData: [],
  loading: false,
  error: null,
  year: 1990,
};

const activityMapSlice = createSlice({
  name: 'activityMap',
  initialState,
  reducers: {
    loadDataset(state) {
      state.loading = true;
      state.error = null;
      state.activityData = [];
    },
    datasetLoaded(state, action: PayloadAction<any[]>) {
      state.activityData = action.payload;
      state.loading = false;
    },
    datasetError(state, action: PayloadAction<any>) {
      state.error = action.payload;
      state.loading = false;
    },
    updateYear(state, action: PayloadAction<any>) {
      state.year = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = activityMapSlice;
