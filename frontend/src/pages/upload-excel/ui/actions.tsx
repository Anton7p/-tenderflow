import { PageActions } from '../../../shared/ui/components/page-actions';

import { actionVisibilityMap, actions } from '../config';

import type { PageUIComponentProps } from '../types';

export function Actions(props: PageUIComponentProps) {
  const { page } = props;
  return <PageActions actionVisibilityMap={actionVisibilityMap} buttons={actions} page={page} />;
}
