'use client'

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface NotificationPayload {
  id: string; 
  title: string;
  body: string;
  timestamp: number; 
}

interface NotificationContextType {
  notifications: NotificationPayload[];
  addNotification: (notification: Omit<NotificationPayload, 'id' | 'timestamp'> & { messageId?: string }) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  const addNotification = useCallback((payload: Omit<NotificationPayload, 'id' | 'timestamp'> & { messageId?: string }) => {
    const newNotification: NotificationPayload = {
      id: payload.messageId || `notif-${Date.now()}`, 
      title: payload.title,
      body: payload.body,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
    // Optional: Giới hạn số lượng thông báo lưu trữ
    // setNotifications((prev) => [newNotification, ...prev].slice(0, 50));
  }, []);

  // Hàm xóa tất cả thông báo
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, clearNotifications }}>
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