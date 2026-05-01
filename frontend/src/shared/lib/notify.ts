import { notification } from 'antd';

interface NotifyParams {
  message: string;
  description?: string;
}

const BASE_OPTIONS = {
  placement: 'bottomRight' as const,
  className: 'app-notification',
};

export const notify = {
  success: ({ message, description }: NotifyParams) =>
    notification.success({ message, description, ...BASE_OPTIONS }),
  info: ({ message, description }: NotifyParams) =>
    notification.info({ message, description, ...BASE_OPTIONS }),
  warning: ({ message, description }: NotifyParams) =>
    notification.warning({ message, description, ...BASE_OPTIONS }),
  error: ({ message, description }: NotifyParams) =>
    notification.error({ message, description, ...BASE_OPTIONS }),
};
