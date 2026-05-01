import { useMemo } from 'react';
import type { PageState, UsePageStateProps } from '../types';

export function usePageState(props: UsePageStateProps): PageState {
  const { store } = props;

  return useMemo(() => {
    const loading = store.loading;
    const settings = store.settings;
    return {
      loading,
      settings,
    };
  }, [store.loading, store.settings]);
}
