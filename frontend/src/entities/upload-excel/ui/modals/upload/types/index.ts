export interface ModalProps {
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onSubmit?: (values?: any) => void;
  onCancel?: () => void;
  params?: unknown | null;
  onApply?: (values?: unknown) => void;
  state?: { loading?: boolean };
}

export interface ModalState {
  isOpen: boolean;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleCancel: () => void;
  handleSubmit: () => void;
}

export interface Modal {
  state: ModalState;
  props: ModalProps;
}
