import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';

export interface AppNotification {
  id: string;
  recipientId: string;   // user id this notification belongs to
  message: string;
  type: 'criteria_assigned' | 'role_changed' | 'doc_approved' | 'doc_rejected' | 'general';
  read: boolean;
  timestamp: string;
}

interface NotificationsState {
  items: AppNotification[];
}

const initialState: NotificationsState = { items: [] };

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    pushNotification(state, action: PayloadAction<Omit<AppNotification, 'id' | 'read' | 'timestamp'>>) {
      state.items.unshift({
        ...action.payload,
        id: `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        read: false,
        timestamp: new Date().toISOString(),
      });
    },
    markRead(state, action: PayloadAction<string>) {
      const n = state.items.find((i) => i.id === action.payload);
      if (n) n.read = true;
    },
    markAllRead(state, action: PayloadAction<string /* recipientId */>) {
      state.items
        .filter((i) => i.recipientId === action.payload)
        .forEach((i) => { i.read = true; });
    },
  },
});

export const { pushNotification, markRead, markAllRead } = notificationsSlice.actions;

/** All notifications for a specific user */
export const selectUserNotifications = (userId: string) => (s: RootState) =>
  s.notifications.items.filter((n) => n.recipientId === userId);

/** Unread count for a specific user */
export const selectUnreadCount = (userId: string) => (s: RootState) =>
  s.notifications.items.filter((n) => n.recipientId === userId && !n.read).length;

export default notificationsSlice.reducer;
