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
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IDCard | null>(null);
  const [form, setForm] = useState<Partial<IDCard>>({});

  // ✅ Fetch all ID cards (client-only)
useEffect(() => {
  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/create-id/fetch");
      const data = await res.json();
      // Ensure we always have an array
      setIdCards(data.idcards || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setIdCards([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  fetchCards();
}, []);


  const saveCard = async () => {
    const method = editing ? "PUT" : "POST";
    const url = editing
      ? `/api/create-id/update/${editing._id}`
      : `/api/create-id/create`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        const res = await fetch("/api/create-id/fetch");
        const data = await res.json();
        setIdCards(data.idcards);
        setOpen(false);
        setEditing(null);
        setForm({});
      }
    } catch (error) {
      console.error("Save Error:", error);
    }
  };

  const deleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ID card?")) return;
    try {
      await fetch(`/api/create-id/delete/${id}`, { method: "DELETE" });
      setIdCards((prev) => prev.filter((card) => card._id !== id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const downloadCard = async (card: IDCard) => {
    try {
      const res = await fetch(`/api/create-id/pdf/${card._id}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${card.name}.pdf`;
      a.click();
    } catch (error) {
      console.error("Download Error:", error);
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
