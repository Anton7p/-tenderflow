import { usePage } from './lib';
import { Content, Spinner, Title, Actions } from './ui';
import { PageLayout } from '@shared/ui';

export function SettingsPage() {
  const page = usePage();
  const title = <Title />;
  const content = <Content page={page} />;
  const actions = <Actions page={page} />;
  return (
    <>
      <PageLayout title={title} actions={actions} content={content} />
      <Spinner page={page} />
    </>
  );
}
