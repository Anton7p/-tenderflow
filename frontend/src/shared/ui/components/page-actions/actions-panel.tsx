import { useLayoutEffect, useMemo, useState } from 'react';
import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';

import styles from './actions-panel.module.css';

interface ActionButton {
  id: string;
  name: string;
  type?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

interface ActionGroup {
  id: string;
  buttons: ActionButton[];
}

interface ActionsPanelProps {
  actions: {
    groups?: ActionGroup[];
  };
}

/** Узкий экран / узкая панель — часть действий уходит в меню «⋯». */
const COMPACT_QUERY = '(max-width: 900px)';

function useCompactActionsBar() {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(COMPACT_QUERY).matches : false,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY);
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return compact;
}

function mapTypeToButton(button: ActionButton): 'primary' | 'default' | 'dashed' {
  if (button.type === 'primary') {
    return 'primary';
  }
  if (button.type === 'danger') {
    return 'dashed';
  }
  return 'default';
}

function renderButton(button: ActionButton) {
  return (
    <Button key={button.id} type={mapTypeToButton(button)} onClick={button.onClick}>
      {button.name}
    </Button>
  );
}

export function ActionsPanel({ actions }: ActionsPanelProps) {
  const compact = useCompactActionsBar();

  const flatButtons = useMemo(
    () => actions.groups?.flatMap((group) => group.buttons) ?? [],
    [actions.groups],
  );

  if (!actions.groups || actions.groups.length === 0 || flatButtons.length === 0) {
    return null;
  }

  if (!compact) {
    return (
      <Space size="middle" wrap className={styles.row}>
        {actions.groups.map((group) => (
          <Space key={group.id} size="small" wrap>
            {group.buttons.map((button) => renderButton(button))}
          </Space>
        ))}
      </Space>
    );
  }

  const primaryBtns = flatButtons.filter((b) => b.type === 'primary');
  const inlineBtns = primaryBtns.length > 0 ? primaryBtns : flatButtons.slice(0, 1);
  const inlineIds = new Set(inlineBtns.map((b) => b.id));
  const overflowBtns = flatButtons.filter((b) => !inlineIds.has(b.id));

  const menuItems: MenuProps['items'] = overflowBtns.map((button) => ({
    key: button.id,
    label: button.name,
    danger: button.type === 'danger',
    onClick: () => button.onClick?.(),
  }));

  return (
    <Space size="small" wrap align="center" className={styles.row}>
      {inlineBtns.map((button) => renderButton(button))}
      {overflowBtns.length > 0 ? (
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <Button
            type="default"
            icon={<MoreOutlined />}
            className={styles.moreBtn}
            aria-label="Ещё действия"
          />
        </Dropdown>
      ) : null}
    </Space>
  );
}
