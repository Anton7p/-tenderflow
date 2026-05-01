import { useMemo } from 'react';
import type { UsePageStateProps } from '../../types';

export function useDocumentsEntity(props: UsePageStateProps) {
  const { store } = props;
  const { documents } = store;

  return useMemo(() => {
    return {
      documents,
      hasDocuments: documents.length > 0,
    };
  }, [documents]);
}
