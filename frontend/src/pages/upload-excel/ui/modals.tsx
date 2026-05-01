import {
  ExportWordModal,
  GroupPositionsModal,
  PositionModal,
  UploadExcelModal,
} from '../../../entities/upload-excel/ui';
import { useModals } from '../lib/ui';
import { ModalsEnum } from '../config';
import type { PageUIComponentProps } from '../types';

export function Modals(props: PageUIComponentProps) {
  const modals = useModals(props);

  return (
    <>
      <UploadExcelModal {...modals[ModalsEnum.UPLOAD_EXCEL]} />
      <GroupPositionsModal {...modals[ModalsEnum.GROUP_POSITIONS]} />
      <PositionModal {...modals[ModalsEnum.POSITION]} />
      <ExportWordModal {...modals[ModalsEnum.EXPORT_WORD]} />
    </>
  );
}
