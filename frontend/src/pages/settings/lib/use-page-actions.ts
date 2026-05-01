import { useMemo } from 'react';
import { usePageActionsVisibility } from './use-page-actions-visibility';
import type { PageActions, UsePageActionsProps } from '../types';

export function usePageActions(props: UsePageActionsProps): PageActions {
  const { store, state } = props;

  const actionsVisibility = usePageActionsVisibility({ store, state });

  const setLoading = store.setLoading;
  const setSettings = store.setSettings;

  return useMemo(
    () => ({
      setLoading,
      setSettings,
      actionsVisibility,
    }),
    [actionsVisibility, setLoading, setSettings]
  );
}
