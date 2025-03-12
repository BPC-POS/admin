import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  QrCode,
  People,
  LocationOn,
} from '@mui/icons-material';
import { Table as TableType, TableStatus } from '@/types/table';

interface TableListProps {
  tables: TableType[];
  onEdit: (table: TableType) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TableStatus) => void;
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

const TableList: React.FC<TableListProps> = ({
  tables,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  console.log("Tables prop:", tables);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedTable, setSelectedTable] = React.useState<TableType | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, table: TableType) => {
    setAnchorEl(event.currentTarget);
    setSelectedTable(table);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTable(null);
  };

  const handleStatusChange = (status: TableStatus) => {
    if (selectedTable) {
      onStatusChange(selectedTable.id, status);
      handleMenuClose();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={table.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                backgroundColor: areaColors[table.area.code as keyof typeof areaColors] || '#fff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
                borderRadius: '16px',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 3, flex: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  mb: 2.5 
                }}>
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 600,
                      fontSize: '1.1rem'
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
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 1.5,
                  color: 'rgba(0,0,0,0.7)'
                }}>
                  <LocationOn fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    {table.area.name}
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 2.5,
                  color: 'rgba(0,0,0,0.7)'
                }}>
                  <People fontSize="small" sx={{ mr: 1 }} />
                  <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    {table.capacity} người
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                  <Chip
                    label={statusLabels[table.status]}
                    color={statusColors[table.status]}
                    size="small"
                    onClick={(e) => handleMenuOpen(e, table)}
                    sx={{ 
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      px: 1
                    }}
                  />
                </Box>

                {table.note && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2.5, 
                      fontFamily: 'Poppins, sans-serif',
                      color: 'rgba(0,0,0,0.6)',
                      fontStyle: 'italic'
                    }}
                  >
                    {table.note}
                  </Typography>
                )}

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 'auto',
                  pt: 2,
                  borderTop: '1px solid rgba(0,0,0,0.08)'
                }}>
                  <Box>
                    <Tooltip title="Sửa">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          mr: 1,
                          '&:hover': { 
                            backgroundColor: 'rgba(0,0,0,0.04)' 
                          } 
                        }}
                        onClick={() => onEdit(table)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton 
                        size="small" 
                        color="error"
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(211,47,47,0.04)' 
                          } 
                        }}
                        onClick={() => onDelete(table.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  {table.qrCode && (
                    <Tooltip title="Xem QR Code">
                      <IconButton 
                        size="small" 
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'rgba(0,0,0,0.04)' 
                          } 
                        }}
                        onClick={() => window.open(table.qrCode)}
                      >
                        <QrCode fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
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
            selected={selectedTable?.status === status}
            sx={{ 
              fontFamily: 'Poppins, sans-serif',
              py: 1.5,
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
                fontWeight: 500
              }}
            />
            {statusLabels[status]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default TableList;
