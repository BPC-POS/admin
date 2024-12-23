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
  Switch,
  Typography,
  Tooltip,
  Box,
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  DragIndicator,
  Visibility,
  VisibilityOff 
} from '@mui/icons-material';
import { MenuItem } from '@/types/menu';
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult,
  DroppableProvided,
  DraggableProvided 
} from 'react-beautiful-dnd';
import Image from 'next/image';

interface MenuListProps {
  menuItems: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onReorder: (items: MenuItem[]) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  menuItems,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort order
    const updatedItems = items.map((item, index) => ({
      ...item,
      sortOrder: index,
    }));

    onReorder(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50}></TableCell>
              <TableCell>Tên menu</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell align="center">Số sản phẩm</TableCell>
              <TableCell align="center">Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <Droppable droppableId="menu-items">
            {(provided: DroppableProvided) => (
              <TableBody 
                ref={provided.innerRef} 
                {...provided.droppableProps}
              >
                {menuItems.map((item, index) => (
                  <Draggable 
                    key={item.id} 
                    draggableId={item.id.toString()} 
                    index={index}
                  >
                    {(provided: DraggableProvided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        hover
                      >
                        <TableCell {...provided.dragHandleProps}>
                          <DragIndicator color="action" />
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-md object-cover"
                              />
                            )}
                            <Typography variant="subtitle1">
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="center">
                          {item.products.length}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={item.isActive}
                              onChange={(e) => onToggleActive(item.id, e.target.checked)}
                              color="primary"
                            />
                            {item.isActive ? 
                              <Visibility color="primary" /> : 
                              <VisibilityOff color="action" />
                            }
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Sửa">
                            <IconButton 
                              size="small" 
                              onClick={() => onEdit(item)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => onDelete(item.id)}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            )}
          </Droppable>
        </Table>
      </TableContainer>
    </DragDropContext>
  );
};

export default MenuList;