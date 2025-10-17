"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
} from "@mui/material";
import { Edit, Delete, Download, Add } from "@mui/icons-material";
import { ClientOnly } from "@/app/components/ClientOnly";

interface Receipt {
  _id: string;
  title: string;
  amount: number;
  date: string;
  description?: string;
}

export default function ReceiptList() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<Receipt | null>(null);

  // ✅ Fetch Receipts
  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-receipt");
      const data = await res.json();
      console.log("Fetched receipts:", data);

      // Defensive data check
      if (data.success && Array.isArray(data.data)) {
        setReceipts(data.data);
      } else if (data.success && Array.isArray(data.receipts)) {
        setReceipts(data.receipts);
      } else {
        console.warn("Unexpected data format:", data);
        setReceipts([]); // fallback to empty array
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setReceipts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  // ✅ Handle Save (Create or Update)
  const handleSave = async () => {
    if (!currentReceipt?.title || !currentReceipt?.amount || !currentReceipt?.date) {
      alert("Please fill Title, Amount, and Date");
      return;
    }

    const method = currentReceipt._id ? "PUT" : "POST";
    const url = currentReceipt._id
      ? `/api/create-receipt/${currentReceipt._id}`
      : `/api/create-receipt`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentReceipt),
      });
      const data = await res.json();

      if (data.success) {
        fetchReceipts();
        setOpenEdit(false);
        setCurrentReceipt(null);
      }
    } catch (err) {
      console.error("Save Error:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this receipt?")) return;
    try {
      const res = await fetch(`/api/create-receipt/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchReceipts();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  // ✅ Download PDF
  const handleDownload = async (id: string) => {
    try {
      const res = await fetch(`/api/create-receipt/pdf/${id}`);
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download Error:", err);
      alert("Failed to download receipt");
    }
  };

  return (
    <ClientOnly>
      <Box sx={{ p: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Receipts
          </Typography>
          <Button
            startIcon={<Add />}
            variant="contained"
            onClick={() => {
              setCurrentReceipt({ _id: "", title: "", amount: 0, date: "", description: "" });
              setOpenEdit(true);
            }}
          >
            Add Receipt
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : receipts?.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No receipts found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              justifyContent: "center",
            }}
          >
            {receipts.map((receipt) => (
              <Card
                key={receipt._id}
                elevation={4}
                sx={{
                  width: 320,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {receipt.title}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Amount:</strong> ₹{receipt.amount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(receipt.date).toLocaleDateString()}
                  </Typography>
                  {receipt.description && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {receipt.description}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setCurrentReceipt(receipt);
                        setOpenEdit(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(receipt._id)}>
                      <Delete />
                    </IconButton>
                    <IconButton color="success" onClick={() => handleDownload(receipt._id)}>
                      <Download />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* 🧾 Add/Edit Dialog */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
          <DialogTitle>{currentReceipt?._id ? "Edit Receipt" : "Add New Receipt"}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2}>
              <TextField
                label="Title"
                fullWidth
                value={currentReceipt?.title || ""}
                onChange={(e) =>
                  setCurrentReceipt((prev) => ({ ...prev!, title: e.target.value }))
                }
              />
              <TextField
                label="Amount (₹)"
                type="number"
                fullWidth
                value={currentReceipt?.amount || ""}
                onChange={(e) =>
                  setCurrentReceipt((prev) => ({ ...prev!, amount: Number(e.target.value) }))
                }
              />
              <TextField
                label="Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={currentReceipt?.date || ""}
                onChange={(e) =>
                  setCurrentReceipt((prev) => ({ ...prev!, date: e.target.value }))
                }
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={currentReceipt?.description || ""}
                onChange={(e) =>
                  setCurrentReceipt((prev) => ({ ...prev!, description: e.target.value }))
                }
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>
              {currentReceipt?._id ? "Update" : "Save"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ClientOnly>
  );
}
