import { Flex } from 'antd';
import { ProjectOutlined, UserOutlined } from '@ant-design/icons';
import styles from './header.module.css';

interface HeaderProps {
  title: string;
  userName?: string;
}

export const Header = ({ title, userName = 'Администратор' }: HeaderProps) => {
  return (
    <Flex align="center" justify="center" className={styles.bar}>
      <Flex align="center" justify="space-between" className={styles.inner}>
        <Flex align="center" gap={12} className={styles.titleRow}>
          <ProjectOutlined className={styles.titleIcon} aria-hidden />
          <strong className={styles.titleText}>{title}</strong>
        </Flex>

        <Flex align="center" gap={16} className={styles.userBlock}>
          <Flex align="center" gap={8}>
            <div className={styles.avatar}>
              <UserOutlined style={{ color: 'var(--color-primary)' }} aria-hidden />
            </div>
            <span className={styles.userName}>{userName}</span>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
