import { useCallback, useMemo, useState } from 'react';
import type { Modal, ModalProps } from '../types';

export function useModal(props: ModalProps): Modal {
  const { onSubmit, onCancel } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAfterClose = useCallback(() => {
    setSelectedFile(null);
  }, []);

  const handleCancel = useCallback(() => {
    setSelectedFile(null);
    onCancel?.();
  }, [onCancel]);

  const handleSubmit = useCallback(() => {
    onSubmit?.(selectedFile);
  }, [onSubmit, selectedFile]);

  const state = useMemo(
    () => ({
      isOpen: props.isOpen || false,
      selectedFile,
      setSelectedFile,
      handleSubmit,
      handleCancel,
      handleAfterClose,
    }),
    [props.isOpen, selectedFile, handleSubmit, handleCancel, handleAfterClose]
  );

  return useMemo(() => ({ state, props }), [state, props]);
}
