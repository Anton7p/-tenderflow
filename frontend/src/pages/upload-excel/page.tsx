import { UploadExcelTableToolbar } from '@entities/upload-excel/ui';
import { PageLayout } from '@shared/ui';
import { usePage } from './lib';
import { Content, Spinner, Actions, Modals } from './ui';

export function UploadExcelPage() {
  const page = usePage();
  const content = <Content page={page} />;
  const actions = <Actions page={page} />;
  const filter = page.state.isFileLoaded ? <UploadExcelTableToolbar table={page.state.table} /> : null;

  return (
    <>
      <PageLayout actions={actions} filter={filter} content={content} />
      <Spinner page={page} />
      <Modals page={page} />
    </>
  );
}
