import { UniversalTable } from '@shared/ui';

import type { UploadExcelTableProps} from '../../types';

export function UploadExcelTable(props: UploadExcelTableProps) {
  const { table } = props;

  return <UniversalTable table={table} />;
}
