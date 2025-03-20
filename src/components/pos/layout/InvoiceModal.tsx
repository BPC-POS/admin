"use client";

import React, { useEffect, useState } from 'react';
import { Modal, Box, IconButton, Typography, CircularProgress } from '@mui/material';
import { Close } from '@mui/icons-material';

interface IFrameInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
}

const IFrameInvoiceModalPOS: React.FC<IFrameInvoiceModalProps> = ({ open, onClose, pdfBlob }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loadingPDF, setLoadingPDF] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setLoadError(null);
    if (open && pdfBlob) { // Chỉ tạo URL khi modal mở và có pdfBlob
      setLoadingPDF(true);
      try {
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (error: unknown) {
        console.error("IFrameInvoiceModalPOS: Error creating Blob URL:", error);
        setLoadError("Lỗi khi tạo URL cho PDF.");
        setPdfUrl(null);
      } finally {
        setLoadingPDF(false);
      }
    } else {
      setPdfUrl(null); // Reset URL khi modal đóng hoặc pdfBlob null
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl); // Giải phóng URL khi component unmount hoặc pdfUrl thay đổi
      }
    };
  }, [open, pdfBlob]); // Theo dõi open và pdfBlob

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="iframe-invoice-modal-title"
      aria-describedby="iframe-invoice-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        height: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="iframe-invoice-modal-title" variant="h6" component="h2">
            Invoice PDF
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        <Box style={{ flex: 1, overflow: 'hidden' }}> {/* overflow: 'hidden' để tránh scrollbar modal */}
          {loadingPDF ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : loadError ? (
            <Typography color="error" textAlign="center">
              {loadError}
            </Typography>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="100%"
              style={{ border: 'none' }} // Loại bỏ border của iframe nếu muốn
              title="Invoice PDF"
            />
          ) : (
            <Typography textAlign="center" color="textSecondary">
              {pdfBlob ? "Đang tải Invoice..." : "Invoice sẽ hiển thị ở đây."}
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default IFrameInvoiceModalPOS;