import { Flex, Button } from 'antd';

interface CommandButton {
  id: string;
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface CommandBarProps {
  buttons: CommandButton[];
}

export const CommandBar = ({ buttons }: CommandBarProps) => {
  return (
    <Flex 
      gap={8} 
      style={{ 
        backgroundColor: 'var(--command-bar-bg)', 
        padding: '12px 16px',
        borderBottom: '1px solid var(--color-border)'
      }}
    >
      {buttons.map((button) => (
        <Button
          key={button.id}
          onClick={button.onClick}
          type={button.primary ? 'primary' : 'default'}
        >
          {button.label}
        </Button>
      ))}
    </Flex>
  );
};
