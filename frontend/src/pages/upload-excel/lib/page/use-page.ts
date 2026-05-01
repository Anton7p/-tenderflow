import { usePageState } from './use-page-state';
import { usePageActions } from './use-page-actions';
import { usePageStore } from './use-page-store';
import type { Page } from '../../types';

export function usePage(): Page {
  const store = usePageStore();
  const state = usePageState({ store });
  const actions = usePageActions({ store, state });
  return { state, actions };
}
