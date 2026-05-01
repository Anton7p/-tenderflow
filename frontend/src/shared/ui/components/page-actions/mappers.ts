import type { ActionsPanelItem, ActionsPanelCpsItem } from './types';

export function mapToActionPanelItems(items: ActionsPanelItem[]): ActionsPanelCpsItem[] {
  return items.map((item) => ({
    groupId: item.groupId,
    title: item.name,
    disabled: item.disabled,
    permissions: item.permissions,
    icon: item.icon,
    appearance: item.type,
    children: item.childrens ? mapToActionPanelItems(item.childrens) : [],
    onClick: item.action
  }));
}

export function mapToActionsPanelModel(actionGroups: Record<string, ActionsPanelItem[]>) {
  return Object.entries(actionGroups).map(([, items]) => mapToActionPanelItems(items));
}
