"use client";

import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import SettingsList from '@/components/admin/settings/SettingsList';
import SettingsModal from '@/components/admin/settings/SettingsModal';
import { Setting } from '@/types/settings';

const defaultSettings: Setting[] = [
  {
    id: 1,
    name: 'Cài đặt thông báo',
    description: 'Quản lý cài đặt thông báo cho người dùng.',
    isActive: true,
  },
  {
    id: 2,
    name: 'Cài đặt bảo mật',
    description: 'Quản lý cài đặt bảo mật cho tài khoản.',
    isActive: false,
  },
];

const AdminSettingPage: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>(defaultSettings);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);

  const handleAddSetting = (setting: Setting) => {
    setSettings([...settings, { ...setting, id: settings.length + 1 }]);
    setIsModalOpen(false);
  };

  const handleEditSetting = (setting: Setting) => {
    setSettings(settings.map(s => (s.id === setting.id ? setting : s)));
    setEditingSetting(null);
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Cài đặt quản trị
      </Typography>
      <Button
        variant="contained"
        onClick={() => {
          setEditingSetting(null);
          setIsModalOpen(true);
        }}
      >
        Thêm cài đặt mới
      </Button>
      <SettingsList
        settings={settings}
        onEdit={(setting) => {
          setEditingSetting(setting);
          setIsModalOpen(true);
        }}
      />
      <SettingsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingSetting ? handleEditSetting : handleAddSetting}
        editSetting={editingSetting}
      />
    </Box>
  );
};

export default AdminSettingPage;