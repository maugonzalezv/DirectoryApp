import { configureStore } from '@reduxjs/toolkit';
import contactsSlice from './contactsSlice';

export const store = configureStore({
  reducer: {
    contacts: contactsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 