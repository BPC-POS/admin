import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
  Chip,
} from '@mui/material';
import { TableArea, Table } from '@/types/table';

interface TableAreaTabsProps {
  areas: TableArea[];
  currentArea: string;
  onAreaChange: (area: string) => void;
  tables: Table[];
}

const TableAreaTabs: React.FC<TableAreaTabsProps> = ({
  areas,
  currentArea,
  onAreaChange,
  tables,
}) => {
  const getTableCount = (areaId: string) => {
    return tables.filter(table => table.area === areaId).length;
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="mb-4">
      <Tabs
        value={currentArea}
        onChange={(_, value) => onAreaChange(value)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          label={
            <Badge 
              badgeContent={tables.length} 
              color="primary"
              showZero
            >
              Tất cả
            </Badge>
          }
          value="all"
        />
        {areas.map((area) => (
          <Tab
            key={area.id}
            label={
              <Badge 
                badgeContent={getTableCount(area.id)} 
                color="primary"
                showZero
              >
                {area.name}
              </Badge>
            }
            value={area.id}
          />
        ))}
      </Tabs>

      <Box className="mt-2 flex gap-2">
        {areas.map((area) => (
          <Chip
            key={area.id}
            label={`${area.name}: ${getTableCount(area.id)} bàn`}
            variant={currentArea === area.id ? 'filled' : 'outlined'}
            onClick={() => onAreaChange(area.id)}
            className="cursor-pointer"
          />
        ))}
      </Box>
    </Box>
  );
};

export default TableAreaTabs;
