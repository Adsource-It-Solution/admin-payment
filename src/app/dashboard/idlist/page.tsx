"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete, Download, Add } from "@mui/icons-material";

interface IDCard {
  _id: string;
  name: string;
  phone: string;
  email: string;
  DOB: string;
  address: string;
  role: string;
  idNumber: string;
}

export default function IDCardList() {
  const [idCards, setIdCards] = useState<IDCard[]>([]);
  const [idcard, setIdCard] = useState<IDCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IDCard | null>(null);
  const [form, setForm] = useState<Partial<IDCard>>({});
  const [openEdit, setOpenEdit] = useState(false);

 const fetchCards = async () => {
  console.log("🟡 [fetchCards] Starting fetch...");
  setLoading(true);
  try {
    const res = await fetch("/api/create-id/fetch");
    console.log("📡 [fetchCards] Response status:", res.status);

    const data = await res.json();
    console.log("📦 [fetchCards] Data received:", data);

    if (data.success) {
      setIdCards(data.createId);
      console.log("✅ [fetchCards] ID cards set successfully");
    } else {
      console.warn("⚠️ [fetchCards] Data fetch failed:", data);
    }
  } catch (err) {
    console.error("❌ [fetchCards] Error fetching cards:", err);
  } finally {
    setLoading(false);
    console.log("🔵 [fetchCards] Loading state set to false");
  }
};
  useEffect(() => {
  console.log("🚀 useEffect: Fetching cards on mount...");
  fetchCards();
}, []);

const saveCard = async () => {
  console.log("🟡 [saveCard] Attempting to save card:", idcard);
  if (!idcard) {
    console.warn("⚠️ [saveCard] No ID card data to save");
    return;
  }

  try {
    const res = await fetch(`/api/create-id/update/${idcard._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idcard),
    });

    console.log("📡 [saveCard] Response status:", res.status);
    const data = await res.json();
    console.log("📦 [saveCard] Response data:", data);

    if (data.success) {
      console.log("✅ [saveCard] Card updated successfully");
      fetchCards();
      setOpenEdit(false);
    } else {
      console.warn("⚠️ [saveCard] Failed to save card:", data);
    }
  } catch (err) {
    console.error("❌ [saveCard] Error saving card:", err);
  }
};

const deleteCard = async (id: string) => {
  console.log("🟡 [deleteCard] Delete initiated for ID:", id);
  if (!confirm("Are you sure you want to delete this ID card?")) {
    console.log("🟠 [deleteCard] Deletion cancelled by user");
    return;
  }

  try {
    const res = await fetch(`/api/create-id/delete/${id}`, { method: "DELETE" });
    console.log("📡 [deleteCard] Response status:", res.status);

    if (res.ok) {
      console.log("✅ [deleteCard] Successfully deleted on server");
      setIdCards((prev) => {
        const updated = prev.filter((card) => card._id !== id);
        console.log("📦 [deleteCard] Updated card list:", updated);
        return updated;
      });
    } else {
      const errorData = await res.json();
      console.warn("⚠️ [deleteCard] Delete failed:", errorData);
    }
  } catch (error) {
    console.error("❌ [deleteCard] Delete Error:", error);
  }
};

const downloadCard = async (card: IDCard) => {
  console.log("🟡 [downloadCard] Downloading card:", card);

  try {
    const res = await fetch(`/api/create-id/pdf/${card._id}`);
    console.log("📡 [downloadCard] Response status:", res.status);

    const blob = await res.blob();
    console.log("📦 [downloadCard] Blob size:", blob.size);

    const url = window.URL.createObjectURL(blob);
    console.log("🌐 [downloadCard] Blob URL created:", url);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${card.name}.pdf`;
    a.click();

    console.log("✅ [downloadCard] File download triggered:", a.download);
  } catch (error) {
    console.error("❌ [downloadCard] Download Error:", error);
  }
};


  return (
    <div className="p-8">
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          ID Cards
        </Typography>
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => {
            setForm({});
            setEditing(null);
            setOpen(true);
          }}
        >
          Add ID
        </Button>
      </Stack>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {idCards.map((card) => (
            <Card key={card._id} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" color="primary">
                  {card.name}
                </Typography>
                <Typography variant="body2">{card.role}</Typography>
                <Typography variant="body2">{card.email}</Typography>
                <Stack direction="row" spacing={1} justifyContent="flex-end" mt={2}>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditing(card);
                      setForm(card);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteCard(card._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="success" onClick={() => downloadCard(card)}>
                    <Download />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🧩 Dialog for Create / Edit */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>{editing ? "Edit ID Card" : "Add New ID Card"}</DialogTitle>
        <DialogContent className="space-y-3 mt-2">
          {["name", "phone", "email", "DOB", "address", "role", "idNumber"].map((field) => (
            <TextField
              key={field}
              label={field.toUpperCase()}
              fullWidth
              value={(form as any)[field] || ""}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveCard}>
            {editing ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
