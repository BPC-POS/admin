'use client';

import React from 'react';
import { useNotifications } from '@/context/NotificationContext';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
    const { notifications, clearNotifications } = useNotifications(); 

    if (!isOpen) {
        return null;
    }

    const formatTimestamp = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-4 md:p-6 rounded-lg w-full max-w-md shadow-lg relative max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-semibold text-gray-800">Thông báo</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none text-3xl leading-none"
                        aria-label="Đóng"
                    >
                        × 
                    </button>
                </div>

                <div className="modal-body overflow-y-auto flex-grow mb-4">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">Không có thông báo nào.</p>
                    ) : (
                        <ul className="space-y-4">
                            {notifications.map((notif) => (
                                <li key={notif.id} className="border-b border-gray-100 pb-3 last:border-b-0">
                                    <p className="font-medium text-gray-800">{notif.title}</p>
                                    <p className="text-sm text-gray-600 mt-1">{notif.body}</p>
                                    <p className="text-xs text-gray-400 mt-2">{formatTimestamp(notif.timestamp)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="mt-auto pt-4 border-t border-gray-200 flex-shrink-0 text-right">
                        <button
                            onClick={clearNotifications} 
                            className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
                        >
                            Xóa tất cả
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;