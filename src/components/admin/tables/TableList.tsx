import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  MenuItem,
  Menu,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  QrCode,
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

const TableList: React.FC<TableListProps> = ({
  tables,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tên bàn</TableCell>
            <TableCell align="center">Khu vực</TableCell>
            <TableCell align="center">Sức chứa</TableCell>
            <TableCell align="center">Trạng thái</TableCell>
            <TableCell align="center">QR Code</TableCell>
            <TableCell align="right">Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tables.map((table) => (
            <TableRow key={table.id} hover>
              <TableCell>
                <Typography variant="subtitle2">{table.name}</Typography>
                {table.note && (
                  <Typography variant="caption" color="text.secondary">
                    {table.note}
                  </Typography>
                )}
              </TableCell>
              <TableCell align="center">{table.area}</TableCell>
              <TableCell align="center">{table.capacity} người</TableCell>
              <TableCell align="center">
                <Chip
                  label={statusLabels[table.status]}
                  color={statusColors[table.status]}
                  size="small"
                  onClick={(e) => handleMenuOpen(e, table)}
                />
              </TableCell>
              <TableCell align="center">
                {table.qrCode ? (
                  <Tooltip title="Xem QR Code">
                    <IconButton size="small" onClick={() => window.open(table.qrCode)}>
                      <QrCode />
                    </IconButton>
                  </Tooltip>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Sửa">
                  <IconButton size="small" onClick={() => onEdit(table)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => onDelete(table.id)}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
                <IconButton
                  size="small"
                  onClick={(e) => handleMenuOpen(e, table)}
                >
                  <MoreVert />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {Object.values(TableStatus).map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusChange(status)}
            selected={selectedTable?.status === status}
          >
            <Chip
              label={statusLabels[status]}
              color={statusColors[status]}
              size="small"
              className="mr-2"
            />
            {statusLabels[status]}
          </MenuItem>
        ))}
      </Menu>
    </TableContainer>
  );
};

export default TableList;
