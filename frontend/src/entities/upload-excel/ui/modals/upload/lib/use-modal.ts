import { useCallback, useMemo, useState } from 'react';
import type { Modal, ModalProps } from '../types';

export function useModal(props: ModalProps): Modal {
  const { onSubmit, onCancel, isOpen } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    onCancel?.();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    onSubmit?.(selectedFile);
  }, [onSubmit, selectedFile]);

  const state = useMemo(
    () => ({
      isOpen: isOpen || false,
      selectedFile,
      setSelectedFile,
      handleSubmit,
      handleCancel,
    }),
    [isOpen, selectedFile, handleSubmit, handleCancel]
  );

  return useMemo(() => ({ state, props }), [state, props]);
}
