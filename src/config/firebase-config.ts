// config/firebase-config.ts (Giả sử bạn đặt trong thư mục config)

import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging, isSupported } from "firebase/messaging"; // Thêm isSupported

const firebaseConfig: FirebaseOptions = {
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

// Hàm helper để lấy messaging instance một cách an toàn phía client
export const getClientMessaging = async (): Promise<Messaging | null> => {
    // Chỉ chạy ở phía client và kiểm tra hỗ trợ
    if (typeof window !== 'undefined' && await isSupported()) {
        if (!messagingInstance) { // Chỉ khởi tạo một lần
            try {
                messagingInstance = getMessaging(firebaseApp);
            } catch (error) {
                console.error("Error initializing Firebase Messaging:", error);
                messagingInstance = null;
            }
        }
        return messagingInstance;
    }
    console.log("Firebase Messaging is not supported in this environment.");
    return null;
};

// Vẫn export các hàm gốc và firebaseApp nếu cần ở nơi khác
export { firebaseApp, getToken, onMessage };