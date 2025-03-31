import React, { useState, useCallback } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Chip,
  Typography,
  Menu,
  MenuItem,
  Box,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  PeopleOutline,
  LocationOnOutlined,
  EditOutlined,
  CheckCircleOutline,
  BlockOutlined,
  EventBusyOutlined,
  CleaningServicesOutlined,
  BuildOutlined,
} from '@mui/icons-material';
import { Table as TableType, TableStatus } from '@/types/table';
import TableModalPOS from './TableModalPOS';

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
  onShowSnackbar: (message: string, severity: 'success' | 'error' | 'info' | 'warning') => void;
}

const statusConfig: Record<TableStatus, { label: string; color: 'success' | 'error' | 'warning' | 'info' | 'default'; icon: React.ElementType }> = {
  [TableStatus.AVAILABLE]: { label: 'Trống', color: 'success', icon: CheckCircleOutline },
  [TableStatus.OCCUPIED]: { label: 'Có khách', color: 'error', icon: BlockOutlined },
  [TableStatus.RESERVED]: { label: 'Đã đặt', color: 'warning', icon: EventBusyOutlined },
  [TableStatus.CLEANING]: { label: 'Đang dọn', color: 'info', icon: CleaningServicesOutlined },
  [TableStatus.MAINTENANCE]: { label: 'Bảo trì', color: 'default', icon: BuildOutlined },
};

const areaBackgrounds: Record<string, string> = {
  'INDOOR': '#E8F5E9',
  'indoor': '#E8F5E9',
  'Trong nhà': '#E8F5E9',
  'OUTDOOR': '#E3F2FD',
  'outdoor': '#E3F2FD',
  'Ngoài trời': '#E3F2FD',
  'VIP': '#FFF3E0',
  'vip': '#FFF3E0',
  'Phòng VIP': '#FFF3E0',
  'default': '#F5F5F5'
};

const getAreaBackground = (area: string | { name?: string } | undefined): string => {
  if (!area) return areaBackgrounds['default'];
  const areaString = (typeof area === 'object' ? area.name : String(area)) || '';
  return areaBackgrounds[areaString.toUpperCase()] || areaBackgrounds['default'];
};

const getAreaName = (table: ApiTableType): string => {
  if (table.area) {
    return typeof table.area === 'object' ? (table.area.name || 'Chưa rõ') : String(table.area);
  }
  return 'Chưa xác định';
};

const TableListPOS: React.FC<TableListPOSProps> = ({
  tables,
  onStatusChange,
  onTableSelect,
  onEdit,
  onShowSnackbar,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTableForMenu, setSelectedTableForMenu] = useState<ApiTableType | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedTableForModal, setSelectedTableForModal] = useState<ApiTableType | null>(null);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, table: ApiTableType) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTableForMenu(table);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleStatusMenuItemClick = useCallback((status: TableStatus) => {
    if (selectedTableForMenu) {
      onStatusChange(selectedTableForMenu.id, status);
      onShowSnackbar(`Đã đổi trạng thái bàn ${selectedTableForMenu.name} thành ${statusConfig[status].label}`, 'success');
    }
    handleMenuClose();
  }, [selectedTableForMenu, onStatusChange, handleMenuClose, onShowSnackbar]);

  const handleEditMenuItemClick = useCallback(() => {
    if (selectedTableForMenu) {
      onEdit(selectedTableForMenu);
    }
    handleMenuClose();
  }, [selectedTableForMenu, onEdit, handleMenuClose]);


  const handleCardClick = useCallback((table: ApiTableType) => {
    if (table.status === TableStatus.OCCUPIED) {
      onShowSnackbar(`Bàn ${table.name} đang có khách. Không thể chọn.`, 'warning');
      return;
    }
    setSelectedTableForModal(table);
    setIsTableModalOpen(true);
  }, [onShowSnackbar]);

  const handleCloseTableModal = useCallback(() => {
    setIsTableModalOpen(false);
    setSelectedTableForModal(null);
  }, []);

  const handleConfirmTableSelect = useCallback((table: ApiTableType) => {
    if (table.areaId === undefined || table.areaId === null) {
       console.warn('Table missing areaId, assigning default 0:', table);
       table.areaId = 0;
    }
    onTableSelect(table);
    handleCloseTableModal();
  }, [onTableSelect, handleCloseTableModal]);


  const tableNote = (table: ApiTableType) => table.note || table.notes;

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
      <Grid container spacing={{ xs: 1.5, sm: 2, md: 2.5 }}>
        {tables.map((table) => {
          const statusInfo = statusConfig[table.status];
          const currentNote = tableNote(table);
          const areaName = getAreaName(table);
          const cardBgColor = getAreaBackground(table.area);

          return (
            <Grid item xs={6} sm={4} md={3} lg={2.4} xl={2} key={table.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  backgroundColor: cardBgColor,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 6,
                  },
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <CardActionArea
                    onClick={() => handleCardClick(table)}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                >
                    <CardContent sx={{
                        p: 2,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 0.5,
                        }}>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    color: 'text.primary',
                                    lineHeight: 1.3,
                                }}
                            >
                                {table.name}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                            <LocationOnOutlined sx={{ fontSize: '1rem' }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                                title={areaName}
                            >
                                {areaName}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: 'text.secondary' }}>
                            <PeopleOutline sx={{ fontSize: '1rem' }} />
                            <Typography
                                variant="body2"
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                }}
                            >
                                {table.capacity} người
                            </Typography>
                        </Box>

                         {currentNote && (
                            <Typography
                                variant="caption"
                                sx={{
                                mt: 0.5,
                                fontFamily: 'Poppins, sans-serif',
                                color: 'text.secondary',
                                fontStyle: 'italic',
                                fontSize: '0.75rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.4,
                                }}
                                title={currentNote}
                            >
                                {currentNote}
                            </Typography>
                        )}

                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ alignSelf: 'flex-start' }}>
                            <Chip
                                icon={<statusInfo.icon sx={{ fontSize: '1rem !important' }} />}
                                label={statusInfo.label}
                                color={statusInfo.color === 'default' ? undefined : statusInfo.color}
                                size="small"
                                sx={{
                                    fontFamily: 'Poppins, sans-serif',
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                    height: '24px',
                                    bgcolor: statusInfo.color === 'default' ? 'action.disabledBackground' : undefined,
                                    '& .MuiChip-icon': { ml: 0.5 },
                                    '& .MuiChip-label': { px: 1 },
                                }}
                            />
                        </Box>
                    </CardContent>
                </CardActionArea>
                 <IconButton
                    aria-label={`Tùy chọn cho bàn ${table.name}`}
                    size="small"
                    onClick={(e) => handleMenuOpen(e, table)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: 'action.active',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                        zIndex: 1,
                    }}
                 >
                    <MoreVert fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        MenuListProps={{
          'aria-labelledby': 'table-actions-button',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 0.5,
            borderRadius: 2,
            minWidth: 220,
            fontFamily: 'Poppins, sans-serif',
          }
        }}
      >
        <MenuItem
          onClick={handleEditMenuItemClick}
          sx={{ fontSize: '0.9rem', py: 1.2 }}
        >
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          Chỉnh sửa thông tin
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <Typography sx={{ px: 2, py: 1, fontSize: '0.8rem', fontWeight: 500, color: 'text.secondary' }}>
          Thay đổi trạng thái:
        </Typography>

        {Object.values(TableStatus).map((status) => {
          const statusInfo = statusConfig[status];
          const isSelected = selectedTableForMenu?.status === status;
          return (
            <MenuItem
              key={status}
              onClick={() => handleStatusMenuItemClick(status)}
              selected={isSelected}
              sx={{
                fontSize: '0.9rem',
                fontWeight: isSelected ? 600 : 400,
                py: 1.2,
                '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                    }
                }
              }}
            >
              <ListItemIcon>
                <statusInfo.icon fontSize="small" color={statusInfo.color === 'default' ? 'action' : statusInfo.color}/>
              </ListItemIcon>
              {statusInfo.label}
            </MenuItem>
          );
        })}
      </Menu>

      {selectedTableForModal && (
          <TableModalPOS
            open={isTableModalOpen}
            onClose={handleCloseTableModal}
            table={selectedTableForModal}
            onConfirm={handleConfirmTableSelect}
          />
      )}
    </Box>
  );
};

export default TableListPOS;