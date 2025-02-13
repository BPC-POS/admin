// components/TableModalPOS.tsx
import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import {
  People,
  LocationOn,
} from '@mui/icons-material';
import { Table as TableType, TableStatus } from '@/types/table';

interface TableModalPOSProps {
  open: boolean;
  onClose: () => void;
  table: TableType | null;
  onConfirm: (table: TableType) => void;
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

const areaColors = {
  'indoor': '#E8F5E9',
  'outdoor': '#F3E5F5',
  'vip': '#FFF3E0'
};


const TableModalPOS: React.FC<TableModalPOSProps> = ({ open, onClose, table, onConfirm }) => {
  if (!table) {
    return null; // Don't render modal if no table is selected
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Xác nhận chọn bàn
        </Typography>

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            backgroundColor: areaColors[table.area as keyof typeof areaColors] || '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            mb: 2,
          }}
        >
          <CardContent sx={{ p: 2, flex: 1 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              {table.name}
            </Typography>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              color: 'rgba(0,0,0,0.7)'
            }}>
              <LocationOn fontSize="inherit" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                {table.area}
              </Typography>
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1.5,
              color: 'rgba(0,0,0,0.7)'
            }}>
              <People fontSize="inherit" sx={{ mr: 0.5 }} />
              <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                {table.capacity} người
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Chip
                label={statusLabels[table.status]}
                color={statusColors[table.status]}
                size="small"
                sx={{
                  fontWeight: 500,
                  px: 0.8,
                  fontSize: '0.8rem'
                }}
              />
            </Box>

            {table.note && (
              <Typography
                variant="body2"
                sx={{
                  mb: 1.5,
                  color: 'rgba(0,0,0,0.6)',
                  fontStyle: 'italic',
                  fontSize: '0.8rem'
                }}
              >
                {table.note}
              </Typography>
            )}
          </CardContent>
        </Card>


        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose}>Huỷ</Button>
          <Button variant="contained" color="primary" onClick={() => onConfirm(table)}>
            Xác nhận chọn bàn
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TableModalPOS;