import type { PageState } from './page';
import type { PageActionVisibilityBase } from '@shared/ui/components/page-actions/types';

export interface Action {
  id: string;
  name: string;
  type: 'primary' | 'secondary';
}

export interface ActionGroups {
  [key: string]: Action[];
}

export type ActionVisibilityCondition = (
  state: PageState,
  context: PageActionVisibilityBase,
) => boolean;

export interface ActionVisibilityMap {
  [key: string]: ActionVisibilityCondition;
}
