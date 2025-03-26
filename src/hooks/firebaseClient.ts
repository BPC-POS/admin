import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getMessaging, getToken, isSupported, Messaging } from "firebase/messaging"; 

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let firebaseApp: FirebaseApp;
if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
} else {
    firebaseApp = getApps()[0];
}

let messagingInstance: Messaging | null = null;

const getClientMessaging = async (): Promise<Messaging | null> => {
    const supported = typeof window !== 'undefined' && await isSupported();
    if (supported) {
        if (!messagingInstance) { 
            try {
                messagingInstance = getMessaging(firebaseApp);
            } catch (error) {
                console.error("Error initializing Firebase Messaging in client:", error);
                messagingInstance = null;
            }
        }
        return messagingInstance;
    }
    return null;
};

export const requestPermission = async (): Promise<string | null> => {
    try {
        if (typeof window === 'undefined' || !('Notification' in window)) {
            console.log("Notifications not supported in this environment.");
            return null;
        }

        const messaging = await getClientMessaging();

        if (!messaging) {
            console.error("Firebase Messaging could not be initialized or is not supported.");
            return null;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");

            const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
            if (!vapidKey) {
                console.error("VAPID key is missing. Set NEXT_PUBLIC_FIREBASE_VAPID_KEY environment variable.");
                return null; 
            }

            const token = await getToken(messaging, { vapidKey: vapidKey });

            if (token) {
                console.log("FCM Token:", token);
                return token;
            } else {
                console.warn("Could not get FCM registration token.");
                return null;
            }
        } else {
            console.warn("User denied notification permission.");
            return null;
        }
    } catch (error) {
        console.error("Error requesting permission or getting FCM token:", error);
        return null;
    }
};

// export { onMessage };