// context/NotificationContext.tsx
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect } from 'react';

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

const LOCAL_STORAGE_KEY = 'fcmNotifications';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedNotifications = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      return savedNotifications ? JSON.parse(savedNotifications) : [];
    } catch (error) {
      console.error("Error reading notifications from localStorage:", error);
      if (typeof window !== 'undefined') {
         window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
      return [];
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
         console.error("Error saving notifications to localStorage:", error);
      }
    }
  }, [notifications]);

  const addNotification = useCallback((payload: Omit<NotificationPayload, 'id' | 'timestamp' | 'read'> & { messageId?: string }) => {
    const newNotification: NotificationPayload = {
      id: payload.messageId || `notif-${Date.now()}-${Math.random()}`,
      title: payload.title,
      body: payload.body,
      timestamp: Date.now(),
      read: false,
    };
    setNotifications((prev) => {
        if (prev.some(n => n.id === newNotification.id)) {
            return prev;
        }
        const newState = [newNotification, ...prev];
        return newState;
    });
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