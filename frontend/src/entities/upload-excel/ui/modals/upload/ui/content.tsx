import { DeleteOutlined, FileOutlined, InboxOutlined } from '@ant-design/icons';
import { Button, Spin } from 'antd';
import { useRef, useState } from 'react';
import type { Modal } from '../types';
import styles from '../styles.module.css';

interface ContentProps {
  modal: Modal;
  loading?: boolean;
}

export function Content({ modal, loading = false }: ContentProps) {
  const { state } = modal;
  const selectedFile = state.selectedFile;
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (file?: File | null) => {
    if (loading || !file) return;
    state.setSelectedFile(file);
  };

  const clearSelection = () => {
    state.setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploadContent}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className={styles.fileInput}
        disabled={loading}
        onChange={(event) => handleFileSelect(event.target.files?.[0])}
      />
      <Spin spinning={loading} tip="Загрузка и обработка на сервере…">
        {!selectedFile ? (
          <div
            className={`${styles.dropZone} ${isDragActive && !loading ? styles.dropZoneActive : ''}`}
            onDragOver={(event) => {
              if (loading) return;
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={(event) => {
              if (loading) return;
              event.preventDefault();
              setIsDragActive(false);
              handleFileSelect(event.dataTransfer.files?.[0]);
            }}
          >
            <InboxOutlined className={styles.uploadIcon} />
            <div className={styles.uploadTitle}>Перетащите файл сюда</div>
            {!loading && (
              <>
                <div className={styles.uploadHint}>или выберите файл вручную</div>
                <Button className={styles.secondaryButton} onClick={openFilePicker}>
                  Выбрать файл
                </Button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.selectedPanel}>
            <div className={styles.selectedFileRow}>
              <FileOutlined className={styles.selectedFileIcon} />
              <div className={styles.selectedFileMeta}>
                <div className={styles.selectedFileName}>{selectedFile.name}</div>
                <div className={styles.selectedFileHint}>
                  Готово к загрузке. Нужен другой файл — замените или очистите выбор.
                </div>
              </div>
            </div>
            {!loading && (
              <div className={styles.selectedActions}>
                <Button className={styles.secondaryButton} onClick={openFilePicker}>
                  Заменить файл
                </Button>
                <Button className={styles.secondaryButton} danger icon={<DeleteOutlined />} onClick={clearSelection}>
                  Очистить
                </Button>
              </div>
            )}
            {!loading && (
              <div
                className={`${styles.replaceDropHint} ${isDragActive ? styles.replaceDropHintActive : ''}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragActive(true);
                }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragActive(false);
                  handleFileSelect(event.dataTransfer.files?.[0]);
                }}
              >
                Или перетащите другой файл сюда — заменит текущий
              </div>
            )}
          </div>
        )}
      </Spin>
    </div>
  );
}
