import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import { TableArea } from '@/types/table';

// Define status enum for tables
enum TableStatus {
  AVAILABLE = 0,
  OCCUPIED = 1,
  RESERVED = 2,
  CLEANING = 3,
  INACTIVE = 4
}

interface ApiTable {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus | number;
  area?: string | { id: number | string; name?: string };
  area_id?: number;
  areaId?: number;
  isActive: boolean;
  qrCode?: string;
  note?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  meta?: Record<string, unknown>;
}

interface TableAreaTabsPOSProps {
  areas: TableArea[];
  currentArea: string;
  onAreaChange: (area: string) => void;
  tables: ApiTable[];
}

const TableAreaTabsPOS: React.FC<TableAreaTabsPOSProps> = ({
  areas,
  currentArea,
  onAreaChange,
  tables,
}) => {
  const getTableCount = (areaId: string) => {
    return tables.filter(table => 
      String(table.area_id) === areaId || 
      String(table.areaId) === areaId || 
      (typeof table.area === 'object' && String(table.area.id) === areaId) || 
      String(table.area) === areaId
    ).length;
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
                badgeContent={getTableCount(String(area.id))} 
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
            value={String(area.id)}
          />
        ))}
      </Tabs>
        
      {/* <Box sx={{ 
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
      </Box> */}
    </Box>
  );
};

export default TableAreaTabsPOS;
