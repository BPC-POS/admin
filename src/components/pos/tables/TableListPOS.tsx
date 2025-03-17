import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Typography,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  MoreVert,
  People,
  LocationOn,
} from '@mui/icons-material';
import { Table as TableType, TableStatus } from '@/types/table';
import TableModalPOS from './TableModalPOS';
// Interface để tương thích với dữ liệu API
interface ApiTableType extends Omit<TableType, 'area' | 'areaId'> {
  area?: string | { name: string };
  areaId: number;
  note?: string;
  notes?: string;
}

interface TableListPOSProps {
  tables: ApiTableType[];
  onEdit: (table: ApiTableType) => void;
  onStatusChange: (id: number, status: TableStatus) => void;
  onTableSelect: (table: ApiTableType) => void;
}

const statusColors = {
  [TableStatus.AVAILABLE]: 'success',
  [TableStatus.OCCUPIED]: 'error',
  [TableStatus.RESERVED]: 'warning',
  [TableStatus.CLEANING]: 'info',
  [TableStatus.MAINTENANCE]: 'default',
} as const;

const statusLabels = {
  [TableStatus.AVAILABLE]: 'Trống',
  [TableStatus.OCCUPIED]: 'Có khách',
  [TableStatus.RESERVED]: 'Đã đặt',
  [TableStatus.CLEANING]: 'Đang dọn',
  [TableStatus.MAINTENANCE]: 'Bảo trì',
};

// Hỗ trợ nhiều loại khu vực
const getAreaBackground = (area: string | { name?: string } | undefined): string => {
  if (!area) return '#f1f3f5'; // Màu mặc định
  
  const areaString = typeof area === 'object' ? (area.name || '') : String(area);
  
  // Map khu vực sang màu
  const areaColors: Record<string, string> = {
    'INDOOR': '#E8F5E9',
    'indoor': '#E8F5E9',
    'Trong nhà': '#E8F5E9',
    'OUTDOOR': '#F3E5F5',
    'outdoor': '#F3E5F5',
    'Ngoài trời': '#F3E5F5',
    'VIP': '#FFF3E0',
    'vip': '#FFF3E0',
    'Phòng VIP': '#FFF3E0'
  };
  
  return areaColors[areaString] || '#f1f3f5';
};

// Hiển thị tên khu vực
const getAreaName = (table: ApiTableType): string => {
  if (table.area) {
    if (typeof table.area === 'object' && table.area.name) {
      return table.area.name;
    }
    return String(table.area);
  }
  return 'Chưa xác định';
};

const TableListPOS: React.FC<TableListPOSProps> = ({
  tables,
  onStatusChange,
  onTableSelect,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTableForMenu, setSelectedTableForMenu] = React.useState<ApiTableType | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedTableForModal, setSelectedTableForModal] = useState<ApiTableType | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, table: ApiTableType) => {
    event.stopPropagation(); // Ngăn sự kiện click truyền đến Card
    setAnchorEl(event.currentTarget);
    setSelectedTableForMenu(table);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTableForMenu(null);
  };

  const handleStatusChange = (status: TableStatus) => {
    if (selectedTableForMenu) {
      onStatusChange(selectedTableForMenu.id, status);
      handleMenuClose();
    }
  };

  const handleOpenTableModal = (table: ApiTableType) => {
    setSelectedTableForModal(table);
    setIsTableModalOpen(true);
  };

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false);
    setSelectedTableForModal(null);
  };

  const handleConfirmTableSelect = (table: ApiTableType) => {
    if (table.areaId === undefined) {
      console.warn('Table has no areaId:', table);
      table.areaId = 0;
    }
    onTableSelect(table); 
    handleCloseTableModal();
  };

  const handleEditTable = (e: React.MouseEvent, table: ApiTableType) => {
    e.stopPropagation(); // Ngăn sự kiện click truyền đến Card
    onEdit(table);
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 1, sm: 2, md: 2.5 }} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        {tables.map((table) => (
          <Grid item xs={6} sm={4} md={3} lg={2} xl={1.5} key={table.id}>
            <Card
              onClick={() => handleOpenTableModal(table)}
              sx={{
                height: '100%',
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: getAreaBackground(table.area),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <CardContent sx={{ 
                p: 2, 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1.5 
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#2C3E50',
                      lineHeight: 1.2,
                      mb: 0.5
                    }}
                  >
                    {table.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, table)}
                    sx={{
                      mt: -0.5,
                      mr: -1,
                      color: 'rgba(0,0,0,0.5)',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        color: 'rgba(0,0,0,0.8)'
                      }
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(0,0,0,0.7)',
                  gap: 0.5
                }}>
                  <LocationOn sx={{ fontSize: '1rem' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {getAreaName(table)}
                  </Typography>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'rgba(0,0,0,0.7)',
                  gap: 0.5
                }}>
                  <People sx={{ fontSize: '1rem' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 500
                    }}
                  >
                    {table.capacity} người
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Chip
                    label={statusLabels[table.status]}
                    color={statusColors[table.status]}
                    size="small"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      height: '24px',
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                </Box>

                {(table.note || table.notes) && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      fontFamily: 'Poppins, sans-serif',
                      color: 'rgba(0,0,0,0.6)',
                      fontStyle: 'italic',
                      fontSize: '0.75rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.3,
                      backgroundColor: 'rgba(0,0,0,0.03)',
                      borderRadius: 1,
                      p: 1,
                      borderLeft: '2px solid rgba(0,0,0,0.1)'
                    }}
                  >
                    {table.note || table.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '12px',
            minWidth: 200
          }
        }}
      >
        <MenuItem 
          onClick={(e) => selectedTableForMenu && handleEditTable(e, selectedTableForMenu)}
          sx={{
            fontFamily: 'Poppins, sans-serif',
            py: 1.5,
            px: 2,
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          Chỉnh sửa thông tin
        </MenuItem>
        
        <MenuItem 
          disabled
          sx={{
            fontFamily: 'Poppins, sans-serif',
            py: 1,
            px: 2,
            fontSize: '0.9rem',
            color: 'rgba(0,0,0,0.7)',
            fontWeight: 600
          }}
        >
          Thay đổi trạng thái:
        </MenuItem>
        
        {Object.values(TableStatus).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            selected={selectedTableForMenu?.status === status}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              py: 1.5,
              px: 2,
              fontSize: '0.9rem',
              pl: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(0,0,0,0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.12)'
                }
              }
            }}
          >
            <Chip
              label={statusLabels[status]}
              color={statusColors[status]}
              size="small"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '0.75rem',
                height: '24px',
                minWidth: '80px',
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
            {statusLabels[status]}
          </MenuItem>
        ))}
      </Menu>

      <TableModalPOS
        open={isTableModalOpen}
        onClose={handleCloseTableModal}
        table={selectedTableForModal as ApiTableType} 
        onConfirm={handleConfirmTableSelect}
      />
    </Box>
  );
};

export default TableListPOS;