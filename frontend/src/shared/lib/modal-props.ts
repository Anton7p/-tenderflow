import { ModalActionsEnum } from './enums';

type ModalStateBase = {
  name: string;
  params: unknown | null;
};

type Config<TState = any> = {
  modal: ModalStateBase;
  onAction: (action: any) => void;
  state?: TState;
};

export function modalProps<TModalProps>(name: string, config: Config) {
  const { onAction, modal, state } = config;
  const isOpen = modal.name === name;
  return {
    isOpen,
    params: isOpen ? modal.params : null,
    onCancel: () => {
      onAction({
        type: ModalActionsEnum.CANCEL,
        meta: { name },
        payload: null,
      });
    },
    onSubmit: (values: unknown | undefined) => {
      onAction({
        type: ModalActionsEnum.SUBMIT,
        meta: { name },
        payload: values,
      });
    },
    onApply: (values: unknown | undefined) => {
      onAction({
        type: ModalActionsEnum.APPLY,
        meta: { name },
        payload: values,
      });
    },
    state,
  } as TModalProps;
}
