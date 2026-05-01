import styles from './styles.module.css';

import type { ReactNode } from 'react';

interface Props {
  title?: ReactNode;
  tabs?: ReactNode;
  actions?: ReactNode;
  filter?: ReactNode;
  content?: ReactNode;
  footer?: ReactNode;
}

export function PageLayout(props: Props) {
  const { title = null, tabs = null, actions = null, filter = null, content = null, footer = null } = props;

  return (
    <div className={styles.pageLayout}>
      <div className={styles.pageLayoutHeader}>
        {title ? <div className={styles.pageLayoutTitle}>{title}</div> : null}
        {tabs ? <div className={styles.pageLayoutTabs}>{tabs}</div> : null}
        {actions || filter ? (
          <div className={styles.pageLayoutTools}>
            {actions ? <div className={styles.pageLayoutActions}>{actions}</div> : null}
            {filter ? <div className={styles.pageLayoutFilter}>{filter}</div> : null}
          </div>
        ) : null}
      </div>
      {content ? <div className={styles.pageLayoutContent}>{content}</div> : null}
      {footer ? <div className={styles.pageLayoutFooter}>{footer}</div> : null}
    </div>
  );
}
