import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null,
    isolineResult: null,
    showNotFoundScreen: false,
  },
  reducers: {
    setIsolineResult: (state, action) => {
      state.isolineResult = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setShowNotFoundScreen: (state, action) => {
      debugger;
      state.showNotFoundScreen = action.payload;
    },
  },
});

export default slice.reducer;

export const setIsolineResult = (payload) => ({ type: 'app/setIsolineResult', payload });
export const setError = (payload) => ({ type: 'app/setError', payload });
export const setShowNotFoundScreen = (payload) => ({
  type: 'app/setShowNotFoundScreen',
  payload,
});
