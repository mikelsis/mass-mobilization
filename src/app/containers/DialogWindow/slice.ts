import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the DialogWindow container
export const initialState: ContainerState = {};

const dialogWindowSlice = createSlice({
  name: 'dialogWindow',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = dialogWindowSlice;
