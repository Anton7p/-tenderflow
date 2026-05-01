import { Button, Space } from 'antd';

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

export function ActionsPanel({ actions }: ActionsPanelProps) {
  if (!actions.groups || actions.groups.length === 0) {
    return null;
  }

  return (
    <Space size="middle">
      {actions.groups.map((group) => (
        <Space key={group.id} size="small">
          {group.buttons.map((button) => (
            <Button
              key={button.id}
              type={button.type === 'primary' ? 'primary' : button.type === 'danger' ? 'dashed' : 'default'}
              onClick={button.onClick}
            >
              {button.name}
            </Button>
          ))}
        </Space>
      ))}
    </Space>
  );
}
