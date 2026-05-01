import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { initialState } from '../config';
import type { Store } from '../types';

export const usePageStore = create<Store>()(
  immer((set) => ({
    loading: initialState.loading,
    documents: initialState.documents,
    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),
    setDocuments: (documents) =>
      set((state) => {
        state.documents = documents;
      }),
  }))
);
