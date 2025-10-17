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
} from "@mui/material";
import { Edit, Delete, Add } from "@mui/icons-material";
import toast from "react-hot-toast"
import { ClientOnly } from "@/app/components/ClientOnly";

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
  const [currentCard, setCurrentCard] = useState<IDCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<IDCard | null>(null);
  const [form, setForm] = useState<Partial<IDCard>>({});
  const [openEdit, setOpenEdit] = useState(false);

  console.log(setCurrentCard);
  console.log(openEdit);
  console.log(loading);
  


  const fetchCards = async () => {
    console.log("🟡 [fetchCards] Starting fetch...");
    setLoading(true);
    try {
      const res = await fetch("/api/create-id");
      const data = await res.json();
      console.log("📦 [fetchCards] Data received:", data);

      if (data.success && Array.isArray(data.data)) {
        setIdCards(data.data); // ✅ use data.data
        console.log("✅ [fetchCards] ID cards set successfully:", data.data);
      } else {
        console.warn("⚠️ [fetchCards] Unexpected response:", data);
        setIdCards([]); // Prevent crash
      }
    } catch (err) {
      console.error("❌ [fetchCards] Error fetching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     💾 Save / Update Card (PUT)
  ====================================================== */
  const saveCard = async () => {
    if (!currentCard?._id) return toast.error("⚠️ Invalid card data");

    console.log("🟡 [saveCard] Updating card:", currentCard);
    try {
      const res = await fetch(`/api/create-id/${currentCard._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCard),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ ID Card updated successfully!");
        fetchCards();
        setOpenEdit(false);
      } else {
        toast.error("❌ Failed to update ID Card");
      }
    } catch (error) {
      console.error("❌ [saveCard] Error:", error);
      toast.error("⚠️ Server error while saving card");
    }
  };

  /* ======================================================
     🗑️ Delete Card
  ====================================================== */
  const deleteCard = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ID card?")) return;

    console.log("🟡 [deleteCard] Deleting ID:", id);
    try {
      const res = await fetch(`/api/create-id/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        toast.success("🗑️ ID Card deleted");
        setIdCards((prev) => prev.filter((card) => card._id !== id));
      } else {
        toast.error("❌ Failed to delete ID Card");
      }
    } catch (error) {
      console.error("❌ [deleteCard] Error:", error);
      toast.error("⚠️ Server error while deleting");
    }
  };

  /* ======================================================
     📥 Download Card (PDF)
  ====================================================== */
  // const downloadCard = async (id: string) => {
  //   console.log("🟡 [downloadCard] Downloading ID:", id);
  //   try {
  //     const res = await fetch(`/api/create-id/${id}/download`);
  //     if (!res.ok) throw new Error("Download failed");

  //     const blob = await res.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `id_card_${id}.pdf`;
  //     a.click();
  //     window.URL.revokeObjectURL(url);

  //     toast.success("✅ ID Card downloaded successfully!");
  //   } catch (error) {
  //     console.error("❌ [downloadCard] Error:", error);
  //     toast.error("⚠️ Failed to download ID Card");
  //   }
  // };

  /* ======================================================
     🚀 On Mount
  ====================================================== */
  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <ClientOnly>

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

        {Array.isArray(idCards) && idCards.length > 0 ? (
          idCards.map((card) => (
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
                  {/* Uncomment when ready to download */}
                  {/* <IconButton color="success" onClick={() => downloadCard(card)}>
            <Download />
          </IconButton> */}
                </Stack>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography
            variant="body1"
            align="center"
            color="textSecondary"
            sx={{ gridColumn: "1 / -1", mt: 4 }}
          >
            No ID cards found.
          </Typography>
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
    </ClientOnly>
  );
}
