import { usePage } from './lib';
import { Content, Spinner, Actions, Modals } from './ui';
import { PageLayout } from '@shared/ui';

export function UploadExcelPage() {
  const page = usePage();
  const content = <Content page={page} />;
  const actions = <Actions page={page} />;

  return (
    <>
      <PageLayout  actions={actions} content={content} />
      <Spinner page={page} />
      <Modals page={page} />
    </>
  );
}
