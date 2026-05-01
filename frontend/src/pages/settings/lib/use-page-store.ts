import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { initialState } from '../config';
import type { Store } from '../types';

export const usePageStore = create<Store>()(
  immer((set) => ({
    loading: initialState.loading,
    settings: initialState.settings,
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),
    setSettings: (settings) =>
      set((state) => {
        state.settings = settings;
      }),
  }))
);
