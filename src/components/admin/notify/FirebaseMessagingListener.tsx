"use client";

import { useEffect } from 'react';
import { getClientMessaging, onMessage } from '@/config/firebase-config';
import { useNotifications } from '@/context/NotificationContext';

const FirebaseMessagingListener = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupMessagingListener = async () => {
        const messaging = await getClientMessaging(); 

        if (messaging) {
            unsubscribe = onMessage(messaging, (payload) => {
              console.log('Foreground Message received by listener:', payload);
              if (payload.notification) {
                addNotification({
                  messageId: payload.messageId,
                  title: payload.notification.title || 'Thông báo',
                  body: payload.notification.body || 'Bạn có tin nhắn mới.',
                });
              }
            });
            console.log("Foreground message listener registered.");
        } else {
            console.log("Could not set up foreground message listener.");
        }
    };

    setupMessagingListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log("Foreground message listener unregistered.");
      }
    };

  }, [addNotification]);

  return null;
};

export default FirebaseMessagingListener;