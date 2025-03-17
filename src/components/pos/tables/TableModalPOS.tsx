// components/TableModalPOS.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  People,
  LocationOn,
} from '@mui/icons-material';
import { Table as TableType, TableStatus } from '@/types/table';

// Interface để tương thích với dữ liệu API
interface ApiTableType extends Omit<TableType, 'area' | 'areaId'> {
  area?: string | { name: string };
  areaId: number;
  note?: string;
  notes?: string;
}

interface TableModalPOSProps {
  open: boolean;
  onClose: () => void;
  table: ApiTableType | null;
  onConfirm: (table: ApiTableType) => void;
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

const TableModalPOS: React.FC<TableModalPOSProps> = ({ open, onClose, table, onConfirm }) => {
  if (!table) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{
        width: { xs: '90%', sm: 450 },
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        p: { xs: 2, sm: 4 },
        position: 'relative',
        overflow: 'auto',
      }}>
        <Typography 
          variant="h5" 
          component="h2" 
          sx={{
            textAlign: 'center',
            mb: 3,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            background: 'linear-gradient(90deg, #2C3E50 0%, #3498DB 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px'
          }}
        >
          XÁC NHẬN CHỌN BÀN
        </Typography>

        <Card
          elevation={0}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: getAreaBackground(table.area),
            borderRadius: 2,
            mb: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 600,
                fontSize: '1.1rem',
                mb: 2,
                color: '#2C3E50'
              }}
            >
              {table.name}
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(0,0,0,0.75)'
              }}>
                <LocationOn sx={{ fontSize: '1.2rem', mr: 1 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.95rem'
                  }}
                >
                  {getAreaName(table)}
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'rgba(0,0,0,0.75)'
              }}>
                <People sx={{ fontSize: '1.2rem', mr: 1 }} />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '0.95rem'
                  }}
                >
                  {table.capacity} người
                </Typography>
              </Box>

              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={statusLabels[table.status]}
                  color={statusColors[table.status]}
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '0.85rem',
                    px: 1,
                    height: 28
                  }}
                />
              </Box>

              {(table.note || table.notes) && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    color: 'rgba(0,0,0,0.6)',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    mt: 1,
                    px: 1,
                    py: 0.5,
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    borderRadius: 1,
                    borderLeft: '3px solid rgba(0,0,0,0.1)'
                  }}
                >
                  {table.note || table.notes}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          mt: 3 
        }}>
          <Button 
            onClick={onClose}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              px: 3,
              borderRadius: 2,
              color: '#2C3E50',
              '&:hover': {
                backgroundColor: 'rgba(44, 62, 80, 0.05)'
              }
            }}
          >
            Huỷ
          </Button>
          <Button 
            variant="contained" 
            onClick={() => onConfirm(table)}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              px: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #2C3E50 0%, #3498DB 100%)',
              boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)',
              '&:hover': {
                background: 'linear-gradient(90deg, #2C3E50 0%, #3498DB 100%)',
                boxShadow: '0 6px 16px rgba(52, 152, 219, 0.3)',
              }
            }}
          >
            Xác nhận chọn bàn
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TableModalPOS;