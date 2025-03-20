import { TableStatus, TableArea } from "./table";

export interface PosTable {
  id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  area?: string | { id: string | number; name: string } | TableArea;
  area_id?: number;
  areaId: number;
  isActive: boolean;
  qrCode?: string;
  note?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  meta: Record<string, unknown>;
}