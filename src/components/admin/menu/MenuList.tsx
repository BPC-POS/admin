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
  onViewDetail: (item: MenuItem) => void;
}

const MenuList: React.FC<MenuListProps> = ({
  menuItems,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  onViewDetail,
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
      <TableContainer component={Paper} className="font-poppins mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={50} className="font-poppins font-semibold"></TableCell>
              <TableCell className="font-poppins font-semibold">Tên menu</TableCell>
              <TableCell className="font-poppins font-semibold">Mô tả</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Số sản phẩm</TableCell>
              <TableCell align="center" className="font-poppins font-semibold">Trạng thái</TableCell>
              <TableCell align="right" className="font-poppins font-semibold">Thao tác</TableCell>
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
                        className="hover:bg-gray-50/50"
                      >
                        <TableCell {...provided.dragHandleProps}>
                          <DragIndicator className="text-gray-400" />
                        </TableCell>
                        <TableCell>
                          <Box className="flex items-center gap-3">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-lg object-cover shadow-sm"
                              />
                            )}
                            <Typography variant="subtitle1" className="font-poppins font-medium">
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="font-poppins text-gray-600">{item.description}</TableCell>
                        <TableCell align="center" className="font-poppins">
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600">
                            {item.products.length}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={item.isActive}
                              onChange={(e) => onToggleActive(item.id, e.target.checked)}
                              color="primary"
                            />
                            {item.isActive ? 
                              <Visibility className="text-blue-500" /> : 
                              <VisibilityOff className="text-gray-400" />
                            }
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Sửa">
                            <IconButton 
                              size="small" 
                              onClick={() => onEdit(item)}
                              className="hover:text-blue-600"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Xóa">
                            <IconButton 
                              size="small"
                              className="text-red-500 hover:text-red-600"
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