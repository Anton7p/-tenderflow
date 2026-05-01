import { useActions } from './lib';
import { ActionsPanel } from './actions-panel';

import type { PageActionsProps, PageActionVisibilityBase } from './types';

export function PageActions<TState, TVisibility extends PageActionVisibilityBase = PageActionVisibilityBase>(
  props: PageActionsProps<TState, TVisibility>
) {
  const actions = useActions(props);
  return (
    <ActionsPanel actions={actions} />
  );
}
