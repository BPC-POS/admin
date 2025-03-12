import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { TableArea, Table } from '@/types/table';

interface TableAreaTabsProps {
  areas: TableArea[];
  currentArea: string;
  onAreaChange: (area: string) => void;
  tables: Table[];
  onEditAreaClick: (area: TableArea) => void;
  onDeleteAreaClick: (areaId: number) => void;
  fetchAreasData: () => void;
}

const TableAreaTabs: React.FC<TableAreaTabsProps> = ({
  areas,
  currentArea,
  onAreaChange,
  tables,
  onEditAreaClick,
  onDeleteAreaClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const getTableCount = (areaId: string) => (
    tables.filter(table => table.area.id === areaId).length
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, areaId: string) => {
    setAnchorEl(prevAnchorEl => ({ ...prevAnchorEl, [areaId]: event.currentTarget }));
  };

  const handleMenuClose = (areaId: string) => {
    setAnchorEl(prevAnchorEl => ({ ...prevAnchorEl, [areaId]: null }));
  };

  const handleEditClick = (area: TableArea) => {
    handleMenuClose(area.id);
    onEditAreaClick(area);
  };

  const handleDeleteClick = (areaId: number) => {
    handleMenuClose(String(areaId)); // areaId is number, key is string
    onDeleteAreaClick(areaId);
  };


  return (
    <Box
      sx={{
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        pb: 2,
        mb: 4,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        padding: 2,
      }}
    >
      <Tabs
        value={currentArea}
        onChange={(_, value) => onAreaChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          '& .MuiTabs-indicator': { height: 3, borderRadius: '3px' },
          '& .MuiTab-root': {
            fontFamily: 'Poppins, sans-serif',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minHeight: 48,
            '&.Mui-selected': { color: 'primary' },
          },
        }}
      >
        <Tab
          label={<Badge badgeContent={tables.length} color="primary" showZero>Tất cả</Badge>}
          value="all"
        />
        {areas.map(area => (
          <Tab
            key={area.id}
            value={area.id}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Badge badgeContent={getTableCount(area.id)} color="primary" showZero>
                  {area.name}
                </Badge>
                <Tooltip title="Tùy chọn khu vực">
                  <IconButton size="small" onClick={event => handleMenuOpen(event, area.id)}>
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl[area.id]}
                  open={Boolean(anchorEl[area.id])}
                  onClose={() => handleMenuClose(area.id)}
                >
                  <MenuItem onClick={() => handleEditClick(area)}>Chỉnh sửa</MenuItem>
                  <MenuItem onClick={() => handleDeleteClick(Number(area.id))}>Xóa</MenuItem>
                </Menu>
              </Box>
            }
          />
        ))}
      </Tabs>

      <Box
        sx={{
          mt: 2,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        {areas.map(area => (
          <Chip
            key={area.id}
            label={`${area.name}: ${getTableCount(area.id)} bàn`}
            variant={currentArea === area.id ? 'filled' : 'outlined'}
            onClick={() => onAreaChange(area.id)}
            onDelete={currentArea === area.id ? () => onDeleteAreaClick(Number(area.id)) : undefined}
            deleteIcon={
              currentArea === area.id ? (
                <IconButton
                  size="small"
                  onClick={event => {
                    event.stopPropagation();
                    handleEditClick(area);
                  }}
                >
                  <i className="ri-edit-line"></i>
                </IconButton>
              ) : undefined
            }
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: currentArea === area.id ? 'primary.main' : 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-1px)',
              },
              ...(currentArea === area.id && {
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': { backgroundColor: 'primary.dark' },
              }),
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TableAreaTabs;