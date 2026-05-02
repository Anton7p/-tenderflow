import { useMemo } from 'react';
import { modalProps } from '@shared/lib';
import { ModalsEnum } from '../../config';
import type { PageUIComponentProps } from '../../types';
import type { ModalProps } from '@entities/upload-excel/ui/modals/upload/types';
import type { UploadExcelRowModel } from '@entities/upload-excel/types/public';

interface GroupPositionsModalProps {
  isOpen: boolean;
  params: { rows: unknown[] } | null;
  onCancel: () => void;
  onSubmit: (values: unknown | undefined) => void;
  onApply: (values: unknown | undefined) => void;
  state?: unknown;
}

interface PositionModalProps {
  isOpen: boolean;
  params: { mode: 'create' | 'edit'; row?: UploadExcelRowModel } | null;
  onCancel: () => void;
  onSubmit: (values: unknown | undefined) => void;
  onApply: (values: unknown | undefined) => void;
  state?: unknown;
}

interface ExportWordModalProps {
  isOpen: boolean;
  params: {
    counterparties: {
      sellerName: string;
      sellerAddress: string;
      sellerInnKpp: string;
      buyerName: string;
      buyerAddress: string;
      buyerInnKpp: string;
    };
    headerFields: {
      status: string;
      documentNumber: string;
      documentDate: string;
      correctionNumber: string;
      correctionDate: string;
      paymentDoc: string;
      shipmentDoc: string;
      currency: string;
      contractId: string;
      baseDocument: string;
    };
    footerFields: {
      pagesInfo: string;
      transferBasis: string;
      transportData: string;
      transferDate: string;
      transferInfo: string;
      receiverDate: string;
      receiverInfo: string;
      sellerResponsible: string;
      buyerResponsible: string;
      sellerEntityName: string;
      buyerEntityName: string;
    };
    docxFields: Record<string, string>;
  } | null;
  onCancel: () => void;
  onSubmit: (values: unknown | undefined) => void;
  onApply: (values: unknown | undefined) => void;
  state?: { loading?: boolean };
}

export function useModals(props: PageUIComponentProps) {
  const { page } = props;
  const { state, actions } = page;
  const { modal, loading } = state;
  const { onAction } = actions;

  const config = useMemo(
    () => ({ modal, onAction, state: { loading } }),
    [modal, onAction, loading]
  );

  return useMemo(
    () => ({
      [ModalsEnum.UPLOAD_EXCEL]: modalProps<ModalProps>(ModalsEnum.UPLOAD_EXCEL, config),
      [ModalsEnum.GROUP_POSITIONS]: modalProps<GroupPositionsModalProps>(ModalsEnum.GROUP_POSITIONS, config),
      [ModalsEnum.POSITION]: modalProps<PositionModalProps>(ModalsEnum.POSITION, config),
      [ModalsEnum.EXPORT_WORD]: modalProps<ExportWordModalProps>(ModalsEnum.EXPORT_WORD, config),
    }),
    [config]
  );
}
