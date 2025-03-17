"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Alert, Snackbar, Paper } from "@mui/material";
import { Add } from "@mui/icons-material";
import TableList from "@/components/admin/tables/TableList";
import TableModal from "@/components/admin/tables/TableModal";
import TableAreaTabs from "@/components/admin/tables/TableAreaTabs";
import {
  Table,
  TableStatus,
  TableArea,
  CreateTableAreaDTO,
  CreateTableDTO,
  numericStatusToTableStatus,
  tableStatusToNumericStatus,
} from "@/types/table";
import AreaModal from "@/components/admin/tables/AreaModal";
import {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  getTableAreas,
  createTableArea,
  updateTableArea,
  deleteTableArea,
} from "@/api/table";

// Define a type for API errors
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
  status?: number;
}

const TablesPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [areas, setAreas] = useState<TableArea[]>([]);
  const [currentArea, setCurrentArea] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | undefined>();
  const [editingArea, setEditingArea] = useState<TableArea | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const fetchTablesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTables();
      const mappedTables = response.data.map((table: Table) => ({
        ...table,
        status:
          (typeof table.status === 'number' && table.status in numericStatusToTableStatus)
            ? numericStatusToTableStatus[table.status as keyof typeof numericStatusToTableStatus]
            : TableStatus.AVAILABLE,
      }));
      setTables(mappedTables);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching tables:", apiError);
      showSnackbar("Lỗi tải dữ liệu bàn", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAreasData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getTableAreas();
      setAreas(response.data);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error fetching areas:", apiError);
      showSnackbar("Lỗi tải dữ liệu khu vực", "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTablesData();
    fetchAreasData();
  }, [fetchTablesData, fetchAreasData]);

  const handleAddTable = async (data: CreateTableDTO) => {
    try {
      setIsLoading(true);
      const tableData = {
        name: data.name,
        capacity: data.capacity,
        notes: data.note || "",
        status: tableStatusToNumericStatus[TableStatus.AVAILABLE] as unknown as number,
        area_id: Number(data.area),
        meta: {},
      };
      await createTable(tableData);
      setIsModalOpen(false);
      showSnackbar("Thêm bàn thành công", "success");
      fetchTablesData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error adding table:", apiError);
      showSnackbar("Có lỗi xảy ra khi thêm bàn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTable = async (data: CreateTableDTO) => {
    if (!editingTable) return;

    try {
      setIsLoading(true);
      const tableData = {
        id: editingTable.id,
        name: data.name,
        capacity: data.capacity,
        notes: data.note || "",
        status: tableStatusToNumericStatus[editingTable.status] as unknown as number,
        areaId: Number(data.area),
        meta: editingTable.meta || {},
      };
      await updateTable(tableData);
      setIsModalOpen(false);
      setEditingTable(undefined);
      showSnackbar("Cập nhật bàn thành công", "success");
      fetchTablesData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating table:", apiError);
      showSnackbar("Có lỗi xảy ra khi cập nhật bàn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTable = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bàn này?")) return;

    try {
      setIsLoading(true);
      await deleteTable(id);
      showSnackbar("Xóa bàn thành công", "success");
      fetchTablesData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error deleting table:", apiError);
      showSnackbar("Có lỗi xảy ra khi xóa bàn", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: TableStatus) => {
    try {
      setIsLoading(true);
      const table = await getTableById(id);
      if (table.data) {
        const tableData = {
          id: id,
          name: table.data.name,
          capacity: table.data.capacity,
          notes: table.data.note || "",
          status: tableStatusToNumericStatus[status] as unknown as number,
          areaId: table.data.areaId,
          meta: table.data.meta || {},
        };
        await updateTable(tableData);
        showSnackbar('Cập nhật trạng thái thành công', 'success');
        fetchTablesData();
      } else {
        showSnackbar('Không tìm thấy bàn để cập nhật trạng thái', 'error');
      }

    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating table status:", apiError);
      showSnackbar('Có lỗi xảy ra khi cập nhật trạng thái', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArea = async (data: CreateTableAreaDTO) => {
    try {
      setIsLoading(true);
      const areaDataToSend = {
        name: data.name,
        description: "",
        isActive: true,
      };
      await createTableArea(areaDataToSend);
      setIsAreaModalOpen(false);
      showSnackbar("Thêm khu vực thành công", "success");
      fetchAreasData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error adding area:", apiError);
      showSnackbar("Có lỗi xảy ra khi thêm khu vực", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditAreaClick = (area: TableArea) => {
    setEditingArea(area);
    setIsAreaModalOpen(true);
  };

  const handleDeleteAreaClick = async (areaId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khu vực này?")) return;

    try {
      setIsLoading(true);
      await deleteTableArea(areaId);
      showSnackbar("Xóa khu vực thành công", "success");
      await fetchAreasData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Lỗi xóa khu vực:", apiError);
      showSnackbar("Có lỗi xảy ra khi xóa khu vực", "error");
    } finally {
      setIsLoading(false);
    }
  };


  const handleEditArea = async (data: Partial<TableArea>) => {
    if (!editingArea) return;

    try {
      setIsLoading(true);
      const areaData = {
        id: Number(editingArea.id),
        name: data.name || editingArea.name,
        description: data.description || editingArea.description || "",
        isActive:
          data.isActive !== undefined ? data.isActive : editingArea.isActive,
      };
      await updateTableArea(areaData);
      setIsAreaModalOpen(false);
      setEditingArea(undefined);
      showSnackbar("Cập nhật khu vực thành công", "success");
      fetchAreasData();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error("Error updating area:", apiError);
      showSnackbar("Có lỗi xảy ra khi cập nhật khu vực", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredTables = React.useMemo(() => {
    if (currentArea === "all") {
      return tables;
    } else {
      return tables.filter((table) => table.area.id === currentArea); 
    }
  }, [tables, currentArea]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C3E50] to-[#3498DB] p-6">
      <Box className="mb-6 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <Typography
          variant="h4"
          component="h1"
          className="font-montserrat font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-300"
        >
          Quản lý bàn
        </Typography>
        <div className="flex gap-4">
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Thêm bàn
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setIsAreaModalOpen(true)}
            className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl font-poppins transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Thêm khu vực
          </Button>
        </div>
      </Box>

      <Paper className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
        <TableAreaTabs
          areas={areas}
          currentArea={currentArea}
          onAreaChange={setCurrentArea}
          tables={filteredTables} // Use filteredTables here!
          onEditAreaClick={handleEditAreaClick} // Corrected prop name
          onDeleteAreaClick={handleDeleteAreaClick} // Corrected prop name
          fetchAreasData={fetchAreasData}
        />

        <TableList
          tables={filteredTables} // Use filteredTables here!
          onEdit={(table) => {
            setEditingTable(table);
            setIsModalOpen(true);
          }}
          onDelete={handleDeleteTable}
          onStatusChange={handleStatusChange}
        />
      </Paper>

      <TableModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(undefined);
        }}
        onSubmit={editingTable ? handleEditTable : handleAddTable}
        editItem={editingTable}
        areas={areas}
        isLoading={isLoading}
      />

      <AreaModal
        open={isAreaModalOpen}
        onClose={() => {
          setIsAreaModalOpen(false);
          setEditingArea(undefined);
        }}
        onSubmit={editingArea ? handleEditArea : handleAddArea}
        editItem={editingArea}
        isLoading={isLoading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </div>
  );
};

export default TablesPage;