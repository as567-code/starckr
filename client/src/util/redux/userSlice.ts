/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store.ts';

export interface UserState {
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  roles: string[] | null;
}

interface Payload {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  roles: null,
} as UserState;

/**
 * A slice of the redux store that contains the user's information. This slice defines reducers for logging in a user and logging out a user.
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Payload>) => {
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.roles = action.payload.roles;
    },
    logout: (state) => {
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.roles = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;

/**
 * A selector that returns the user state
 * @param state The redux store state
 * @returns The user state
 */
export const selectUser = (state: RootState) => state.user;
