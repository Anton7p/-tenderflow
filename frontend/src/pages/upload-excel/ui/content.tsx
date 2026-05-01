import { Button, Spin, Space } from 'antd';
import { EmptyContent } from './empty-content';
import { UploadExcelTable } from '@entities/upload-excel/ui';
import { ActionsEnum } from '../config';
import styles from '../page.module.css';
import type { PageUIComponentProps } from '../types';

export function Content(props: PageUIComponentProps) {
  const { page } = props;
  const { state, actions } = page;
  const { loading, isFileLoaded, table } = state;
  const { onAction } = actions;

  return (
    <Spin spinning={loading}>
      <>
        {!isFileLoaded ? (
          <Space orientation="vertical" align="center" className={styles.dropzone} style={{ width: '100%' }}>
            <EmptyContent text="Загрузите Excel файл для отображения данных" />
            <Button type="primary" onClick={() => onAction?.({ type: ActionsEnum.UPLOAD_EXCEL })}>
              Загрузить Excel
            </Button>
          </Space>
        ) : (

            <UploadExcelTable table={table} showColumnTools={false} draggableColumns />

        )}
      </>
    </Spin>
  );
}
