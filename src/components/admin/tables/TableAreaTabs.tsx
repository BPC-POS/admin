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
    <Box 
      sx={{ 
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        pb: 2,
        mb: 4,
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        p: 2
      }}
    >
      <Tabs
        value={currentArea}
        onChange={(_, value) => onAreaChange(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: '#1976d2',
            height: 3,
            borderRadius: '3px'
          },
          '& .MuiTab-root': {
            fontFamily: 'Poppins, sans-serif',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            minHeight: 48,
            '&.Mui-selected': {
              color: '#1976d2'
            }
          }
        }}
      >
        <Tab
          label={
            <Badge 
              badgeContent={tables.length} 
              color="primary"
              showZero
              sx={{
                '& .MuiBadge-badge': {
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600
                }
              }}
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
                sx={{
                  '& .MuiBadge-badge': {
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600
                  }
                }}
              >
                {area.name}
              </Badge>
            }
            value={area.id}
          />
        ))}
      </Tabs>

      <Box sx={{ 
        mt: 2,
        display: 'flex',
        gap: 1,
        flexWrap: 'wrap'
      }}>
        {areas.map((area) => (
          <Chip
            key={area.id}
            label={`${area.name}: ${getTableCount(area.id)} bàn`}
            variant={currentArea === area.id ? 'filled' : 'outlined'}
            onClick={() => onAreaChange(area.id)}
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: currentArea === area.id 
                  ? '#1976d2' 
                  : 'rgba(25, 118, 210, 0.04)',
                transform: 'translateY(-1px)'
              },
              ...(currentArea === area.id && {
                backgroundColor: '#1976d2',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#1565c0'
                }
              })
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default TableAreaTabs;
