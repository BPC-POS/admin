import React, { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging"; 

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

let firebaseAppInitialized = false; 

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    const [token, setToken] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ title: string; body: string }>({ title: '', body: '' });
    const [messagingInstance, setMessagingInstance] = useState<Messaging | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window) {
            if (!firebaseAppInitialized) {
                const firebaseConfig = {
                    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
                };
                initializeApp(firebaseConfig);
                firebaseAppInitialized = true; 
            }

            const messaging = getMessaging();
            setMessagingInstance(messaging); 

        } else {
            console.warn("Firebase Messaging is not supported in this environment.");
        }
    }, []);

    useEffect(() => {
        if (messagingInstance) {
            requestNotificationPermission(messagingInstance);
            getTokenFirebase(messagingInstance);
            handleForegroundMessage(messagingInstance);
        }
    }, [messagingInstance]); 

    const requestNotificationPermission = async (messaging: Messaging) => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            } else if (permission === 'denied') {
                console.log('Notification permission denied.');
            } else {
                console.log('Notification permission dismissed.');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    };

    const getTokenFirebase = async (messaging: Messaging) => {
        try {
            const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY }); // Thêm VAPID Key
            if (currentToken) {
                setToken(currentToken);
                console.log('FCM registration token:', currentToken);
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } catch (error) {
            console.error('An error occurred while retrieving token:', error);
        }
    };

    const handleForegroundMessage = async (messaging: Messaging) => {
        onMessage(messaging, (payload) => {
            console.log('Message received in foreground:', payload);
            setNotification({
                title: payload.notification?.title || 'New Notification',
                body: payload.notification?.body || 'No message body',
            });

        });
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-4/5 max-w-md shadow-lg relative">
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Thông báo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <span className="text-2xl">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    {notification.title && (
                        <div>
                            <p>**Thông báo mới nhận được:**</p>
                            <p>Tiêu đề: {notification.title}</p>
                            <p>Nội dung: {notification.body}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationModal;