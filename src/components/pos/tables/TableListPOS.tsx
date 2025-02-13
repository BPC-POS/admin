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
import TableModalPOS from './TableModalPOS'; // Import TableModalPOS component

interface TableListPOSProps {
  tables: TableType[];
  onEdit: (table: TableType) => void;
  onStatusChange: (id: number, status: TableStatus) => void;
  onTableSelect: (table: TableType) => void; // Add onTableSelect prop to handle table selection
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

const TableListPOS: React.FC<TableListPOSProps> = ({
  tables,
  onEdit,
  onStatusChange,
  onTableSelect, // Get onTableSelect from props
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTableForMenu, setSelectedTableForMenu] = React.useState<TableType | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false); // State to control modal visibility
  const [selectedTableForModal, setSelectedTableForModal] = useState<TableType | null>(null); // State to store table for modal

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, table: TableType) => {
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

  const handleOpenTableModal = (table: TableType) => {
    setSelectedTableForModal(table);
    setIsTableModalOpen(true);
  };

  const handleCloseTableModal = () => {
    setIsTableModalOpen(false);
    setSelectedTableForModal(null);
  };

  const handleConfirmTableSelect = (table: TableType) => {
    onTableSelect(table); 
    handleCloseTableModal();
  };


  return (
    <Box sx={{ flexGrow: 1, p: 1 }}>
      <Grid container spacing={2}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={3} lg={1.5} xl={1.5} key={table.id}>
            <Card
              onClick={() => handleOpenTableModal(table)} // Open modal when Card is clicked
              sx={{
                height: '90%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: areaColors[table.area as keyof typeof areaColors] || '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer', // Indicate card is clickable
              }}
            >
              <CardContent sx={{ p: 2, flex: 1 }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1.5
                }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    {table.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, table)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  color: 'rgba(0,0,0,0.7)'
                }}>
                  <LocationOn fontSize="inherit" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
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
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
                    {table.capacity} người
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Chip
                    label={statusLabels[table.status]}
                    color={statusColors[table.status]}
                    size="small"
                    onClick={(e) => handleMenuOpen(e, table)}
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      px: 0.8,
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>

                {table.note && (
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 1.5,
                      fontFamily: 'Poppins, sans-serif',
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
            borderRadius: '12px'
          }
        }}
      >
        {Object.values(TableStatus).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            selected={selectedTableForMenu?.status === status}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              py: 1,
              fontSize: '0.85rem',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            <Chip
              label={statusLabels[status]}
              color={statusColors[status]}
              size="small"
              sx={{
                mr: 2,
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '0.75rem'
              }}
            />
            {statusLabels[status]}
          </MenuItem>
        ))}
      </Menu>

      {/* Render TableModalPOS component */}
      <TableModalPOS
        open={isTableModalOpen}
        onClose={handleCloseTableModal}
        table={selectedTableForModal}
        onConfirm={handleConfirmTableSelect}
      />
    </Box>
  );
};

export default TableListPOS;