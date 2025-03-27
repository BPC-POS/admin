"use client";

import { useEffect, useRef } from 'react'; 
import { getClientMessaging, onMessage } from '@/config/firebase-config';
import { useNotifications } from '@/context/NotificationContext';

let notificationChannel: BroadcastChannel | null = null;

const FirebaseMessagingListener = () => {
  const { addNotification } = useNotifications();
  const addNotificationRef = useRef(addNotification);
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    let unsubscribeForeground: (() => void) | null = null;

    const initializeMessaging = async () => {
      const messaging = await getClientMessaging();

      if (messaging) {
        unsubscribeForeground = onMessage(messaging, (payload) => {
        console.log('Foreground Message received:', payload);
        if (payload.notification) {
          addNotificationRef.current({
            messageId: payload.messageId,
            title: payload.notification.title || 'Thông báo',
            body: payload.notification.body || 'Bạn có tin nhắn mới.',
          });
        }
      });
    } else {
      console.log("Firebase Messaging không khả dụng.");
    }

    if (!notificationChannel) {
        notificationChannel = new BroadcastChannel('fcm-notifications');
        console.log("Broadcast Channel 'fcm-notifications' created.");
    }

    const handleChannelMessage = (event: MessageEvent) => {
        console.log("Broadcast Channel message received:", event.data);
        if (event.data && event.data.type === 'NEW_NOTIFICATION' && event.data.payload) {
             addNotificationRef.current({
                 messageId: event.data.payload.messageId,
                 title: event.data.payload.title,
                 body: event.data.payload.body,
             });
        }
    };

    notificationChannel.addEventListener('message', handleChannelMessage);
    console.log("Broadcast Channel listener added.");

    initializeMessaging();

    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
        console.log("Foreground listener unsubscribed.");
      }
        console.log("Foreground listener unsubscribed.");
      }
    };
  }, [addNotification]);

  return null;
};

export default FirebaseMessagingListener;