import { createSlice } from '@reduxjs/toolkit';

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    selectedDate: new Date().toISOString().split('T')[0], 
  },
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    resetState: (state) => {
      return initialState;
    }
  },
});

export const { setSelectedDate } = dateSlice.actions;
export default dateSlice.reducer; 