import { InboxOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useRef, useState } from 'react';
import type { Modal } from '../types';
import styles from '../styles.module.css';

interface ContentProps {
  modal: Modal;
}

export function Content({ modal }: ContentProps) {
  const { state } = modal;
  const [isDragActive, setIsDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelect = (file?: File | null) => {
    if (!file) return;
    setFileName(file.name);
    state.setSelectedFile(file);
  };

  return (
    <div className={styles.uploadContent}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className={styles.fileInput}
        onChange={(event) => handleFileSelect(event.target.files?.[0])}
      />
      <div
        className={`${styles.dropZone} ${isDragActive ? styles.dropZoneActive : ''}`}
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
        <InboxOutlined className={styles.uploadIcon} />
        <div className={styles.uploadTitle}>Перетащите файл сюда</div>
        <div className={styles.uploadHint}>или выберите файл вручную</div>
        <Button className={styles.secondaryButton} onClick={() => fileInputRef.current?.click()}>
          Выбрать файл
        </Button>
        {fileName && <div className={styles.fileName}>Выбран файл: {fileName}</div>}
      </div>
    </div>
  );
}
