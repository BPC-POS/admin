"use client";

import React, { useState } from 'react';
import { Avatar, IconButton, Badge } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useRouter } from "next/navigation";

import NotificationModal from '@/components/admin/notify/NotificationModal'; 
import { useNotifications } from '@/context/NotificationContext'; 

const POSHeader: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const { unreadCount, markAllAsRead } = useNotifications();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const handlePushPos = () => {
        router.push('/pos');
    };

    const handleOpenNotificationModal = () => {
        setIsNotificationModalOpen(true);
        markAllAsRead();
        console.log('POS Notification Modal opened');
    };

    const handleCloseNotificationModal = () => {
        setIsNotificationModalOpen(false);
        console.log('POS Notification Modal closed');
    };

    return (
        <header className="text-white p-4 font-poppins" style={{ backgroundColor: "#2C3E50" }}>
            <div className="container mx-auto flex justify-between items-center">

                <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600
                                     focus:outline-none focus:border-gray-500 text-white placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        >
                            <SearchIcon className="text-gray-400" />
                        </button>
                    </div>
                </form>

                <div className="flex items-center space-x-4">
                    <IconButton onClick={handlePushPos}>
                        <Badge badgeContent={0} color="error">
                            <StorefrontIcon
                                sx={{ color: 'white' }}
                            />
                        </Badge>
                    </IconButton>

                    <IconButton sx={{ color: 'white' }} onClick={handleOpenNotificationModal}>
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon sx={{ color: 'white' }} />
                        </Badge>
                    </IconButton>

                    <IconButton sx={{ color: 'white' }}>
                        <Badge badgeContent={2} color="error">
                            <EmailIcon sx={{ color: 'white' }} />
                        </Badge>
                    </IconButton>

                    <IconButton sx={{ color: 'white' }}>
                        <LogoutIcon sx={{ color: 'white' }} />
                    </IconButton>

                    <div className="flex items-center space-x-2">
                        <Avatar alt="Admin Avatar" src="/images/avatar.png" />
                        <div className="hidden md:block">
                            <div className="text-sm font-semibold">Admin Name</div>
                            <div className="text-xs opacity-75">Super Admin</div>
                        </div>
                    </div>
                </div>
            </div>

            <NotificationModal
                isOpen={isNotificationModalOpen}
                onClose={handleCloseNotificationModal}
            />

        </header>
    );
};

export default POSHeader;