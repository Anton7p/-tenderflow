import { BankOutlined, FileTextOutlined, RightOutlined } from '@ant-design/icons';
import styles from './main.module.css';

const HERO_TITLE = 'Подготовка документов для тендеров и закупок';

const HERO_LEAD =
  'Инструмент для ручной настройки и выгрузки форм: загрузите Excel, отредактируйте позиции и сохраните готовые DOCX по вашим шаблонам.';

interface MainPageProps {
  onOpenSection: (tabId: string) => void;
}

const sections = [
  {
    id: 'upd-downloads',
    title: 'Выгрузка УПД',
    description: 'Реестр из Excel, правка позиций и сохранение DOCX под ваш шаблон.',
    icon: <FileTextOutlined />,
  },
  {
    id: 'payment-account',
    title: 'Расчётный счёт',
    description: 'В разработке: формы и сценарии появятся позже.',
    icon: <BankOutlined />,
  },
] as const;

export function MainPage({ onOpenSection }: MainPageProps) {
  const open = (id: string) => () => onOpenSection(id);

  return (
    <div className={styles.pageRoot}>
      <header className={styles.darkBandTop}>
        <div className={styles.darkBandConstrain}>
          <h1 className={styles.darkBandTitle}>{HERO_TITLE}</h1>
          <p className={styles.darkBandMuted}>{HERO_LEAD}</p>
        </div>
      </header>

      <div className={`${styles.contentArea} ${styles.modeCommand}`}>
        <div className={styles.contentInner}>
          {sections.map((s) => (
            <button key={s.id} type="button" className={styles.tileRow} onClick={open(s.id)}>
              <span className={styles.tileIcon}>{s.icon}</span>
              <span className={styles.tileBody}>
                <div className={styles.tileTitle}>{s.title}</div>
                <p className={styles.tileDesc}>{s.description}</p>
              </span>
              <RightOutlined className={styles.tileArrow} aria-hidden />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
