import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const oneCTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: 'var(--color-primary)',
    colorPrimaryHover: 'var(--color-primary-hover)',
    colorPrimaryActive: 'var(--color-primary-active)',
    borderRadius: 1,
    borderRadiusLG: 1,
    borderRadiusSM: 1,
    borderRadiusXS: 1,
    colorBgLayout: 'var(--color-bg-layout)',
    fontFamily: 'Inter, system-ui, sans-serif',
    colorBgContainer: 'var(--color-bg-container)',
    colorBorder: 'var(--color-border)',
    colorText: 'var(--color-text-primary)',
    colorTextSecondary: 'var(--color-text-secondary)',
    colorLink: 'var(--panel-link)',
  },
  components: {
    Button: {
      borderRadius: 1,
      controlHeight: 32,
      boxShadow: 'none',
      primaryBg: 'var(--color-primary)',
      primaryColor: 'var(--color-text-on-primary)',
      defaultBg: 'var(--color-bg-container)',
      defaultColor: 'var(--color-text-primary)',
    },
    Table: {
      headerBg: 'var(--table-header-bg)',
      headerColor: 'var(--color-text-primary)',
      borderColor: 'var(--color-border)',
      borderRadius: 1,
    },
    Input: {
      borderRadius: 1,
      controlHeight: 32,
      colorBorder: 'var(--color-border)',
    },
    Select: {
      borderRadius: 1,
      controlHeight: 32,
    },
    Menu: {
      itemSelectedBg: 'var(--color-primary)',
      itemSelectedColor: 'var(--color-text-on-primary)',
      borderRadius: 1,
    },
    Card: {
      borderRadius: 1,
    },
    Modal: {
      borderRadius: 1,
    },
    Tabs: {
      borderRadius: 1,
    },
  },
};
