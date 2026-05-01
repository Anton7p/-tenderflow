import { theme } from 'antd';

const { defaultAlgorithm } = theme;

export const oneCTheme = {
  algorithm: defaultAlgorithm,
  token: {
    colorPrimary: '#FFD045',
    borderRadius: 1,
    borderRadiusLG: 1,
    borderRadiusSM: 1,
    borderRadiusXS: 1,
    colorBgLayout: '#F8FAFC',
    fontFamily: 'Inter, system-ui, sans-serif',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#D9D9D9',
    colorText: '#333333',
    colorTextSecondary: '#666666',
  },
  components: {
    Button: {
      borderRadius: 1,
      controlHeight: 32,
      boxShadow: 'none',
      primaryBg: '#FFD045',
      primaryColor: '#333333',
      defaultBg: '#FFFFFF',
      defaultColor: '#333333',
    },
    Table: {
      headerBg: '#F2F2F2',
      headerColor: '#333',
      borderColor: '#D9D9D9',
      borderRadius: 1,
    },
    Input: {
      borderRadius: 1,
      controlHeight: 32,
      colorBorder: '#D9D9D9',
    },
    Select: {
      borderRadius: 1,
      controlHeight: 32,
    },
    Menu: {
      itemSelectedBg: '#FFD045',
      itemSelectedColor: '#333',
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
