"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';

interface NotificationPayload {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationPayload[];
  unreadCount: number; 
  addNotification: (notification: Omit<NotificationPayload, 'id' | 'timestamp' | 'read'> & { messageId?: string }) => void;
  markAsRead: (id: string) => void; 
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  const addNotification = useCallback((payload: Omit<NotificationPayload, 'id' | 'timestamp' | 'read'> & { messageId?: string }) => {
    const newNotification: NotificationPayload = {
      id: payload.messageId || `notif-${Date.now()}-${Math.random()}`,
      title: payload.title,
      body: payload.body,
      timestamp: Date.now(),
      read: false, 
    };
    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.read ? notif : { ...notif, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((notif) => !notif.read).length;
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{
        notifications,
        unreadCount, 
        addNotification,
        markAsRead, 
        markAllAsRead, 
        clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};