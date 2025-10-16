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
import { toast } from "react-toastify";
import { Edit, Delete, Download } from "@mui/icons-material";

interface Certificate {
  _id: string;
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
}

export default function CertificatesList() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentCert, setCurrentCert] = useState<Certificate | null>(null);

  // 🧠 Replace this with real user session ID in production
  const userId = "userId123";

    //  📄 Fetch All Certificates (GET /api/certificates?userId=)
  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/certificates?userId=${userId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setCertificates(data.data);
      } else {
        toast.error(data.message || "❌ Failed to fetch certificates");
      }
    } catch (err) {
      console.error("fetchCertificates error:", err);
      toast.error("⚠️ Server error while fetching certificates");
    } finally {
      setLoading(false);
    }
  };

    //  🗑️ Delete Certificate (DELETE /api/certificates/:id)
  const deleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const res = await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        toast.success("🗑️ Certificate deleted successfully");
        fetchCertificates();
      } else {
        toast.error(data.message || "❌ Failed to delete certificate");
      }
    } catch (err) {
      console.error("deleteCertificate error:", err);
      toast.error("⚠️ Server error while deleting");
    }
  };

    //  ✏️ Open Edit Dialog 
  const handleEdit = (cert: Certificate) => {
    setCurrentCert(cert);
    setOpenEdit(true);
  };

    //  💾 Save Edited Certificate (PUT /api/certificates/:id)
  const handleSaveEdit = async () => {
    if (!currentCert) return;

    try {
      const res = await fetch(`/api/certificates/${currentCert._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCert),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Certificate updated successfully");
        setOpenEdit(false);
        fetchCertificates();
      } else {
        toast.error(data.message || "❌ Failed to update certificate");
      }
    } catch (err) {
      console.error("handleSaveEdit error:", err);
      toast.error("⚠️ Server error while updating");
    }
  };

    //  📥 Download Certificate (GET /api/certificates/:id/download)
  const handleDownload = async (id: string) => {
    try {
      const res = await fetch(`/api/certificates/${id}/download`);
      if (!res.ok) throw new Error("Failed to download certificate");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("handleDownload error:", err);
      toast.error("⚠️ Failed to download certificate");
    }
  };

    //  🚀 Fetch on Mount 
  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f7f9fc", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center" color="#0E1F47">
        🎓 Certificates
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}>
          <CircularProgress />
        </Box>
      ) : certificates.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No certificates found. Try saving one from the editor.
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
          {certificates.map((cert) => (
            <Card
              key={cert._id}
              elevation={4}
              sx={{
                flex: "1 1 320px",
                maxWidth: "400px",
                borderRadius: 3,
                p: 2,
                transition: "0.3s",
                "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
              }}
            >
              <CardContent>
                <Typography variant="h6" color="#0E1F47" gutterBottom>
                  {cert.title}
                </Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {cert.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, minHeight: 60 }}
                >
                  {cert.description}
                </Typography>

                <Stack direction="row" spacing={1} mt={2} justifyContent="flex-end">
                  <IconButton color="primary" onClick={() => handleEdit(cert)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteCertificate(cert._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton color="success" onClick={() => handleDownload(cert._id)}>
                    <Download />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* ✏️ Edit Certificate Modal */}
      <Dialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Certificate</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              fullWidth
              value={currentCert?.name || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({ ...prev!, name: e.target.value }))
              }
            />
            <TextField
              label="Title"
              fullWidth
              value={currentCert?.title || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({ ...prev!, title: e.target.value }))
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={currentCert?.description || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({
                  ...prev!,
                  description: e.target.value,
                }))
              }
            />
            <TextField
              label="Leader Name"
              fullWidth
              value={currentCert?.leaderName || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({
                  ...prev!,
                  leaderName: e.target.value,
                }))
              }
            />
            <TextField
              label="Leader Title"
              fullWidth
              value={currentCert?.leaderTitle || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({
                  ...prev!,
                  leaderTitle: e.target.value,
                }))
              }
            />
            <TextField
              label="Advisor Name"
              fullWidth
              value={currentCert?.advisorName || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({
                  ...prev!,
                  advisorName: e.target.value,
                }))
              }
            />
            <TextField
              label="Advisor Title"
              fullWidth
              value={currentCert?.advisorTitle || ""}
              onChange={(e) =>
                setCurrentCert((prev) => ({
                  ...prev!,
                  advisorTitle: e.target.value,
                }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
