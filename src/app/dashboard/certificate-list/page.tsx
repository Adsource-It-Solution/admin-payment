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
  Grid,
} from "@mui/material";

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

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates/fetch");
      const data = await res.json();
      if (data.success) setCertificates(data.certificates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certificate?")) return;
    try {
      const res = await fetch(`/api/certificates/delete/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchCertificates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cert: Certificate) => {
    setCurrentCert(cert);
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    if (!currentCert) return;
    try {
      const res = await fetch(`/api/certificates/update/${currentCert._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCert),
      });
      const data = await res.json();
      if (data.success) {
        fetchCertificates();
        setOpenEdit(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const res = await fetch(`/api/certificates/download/${id}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download certificate");
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
        Certificates
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
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
            <Box
              key={cert._id}
              sx={{
                flex: "1 1 300px", 
                maxWidth: "400px",
              }}
            >
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)", boxShadow: 6 },
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {cert.title}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {cert.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
            </Box>
          ))}
        </Box>

      )}

      {/* ✏️ Edit Modal */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Certificate</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Name"
              fullWidth
              value={currentCert?.name || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, name: e.target.value }))}
            />
            <TextField
              label="Title"
              fullWidth
              value={currentCert?.title || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, title: e.target.value }))}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={currentCert?.description || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, description: e.target.value }))}
            />
            <TextField
              label="Leader Name"
              fullWidth
              value={currentCert?.leaderName || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, leaderName: e.target.value }))}
            />
            <TextField
              label="Leader Title"
              fullWidth
              value={currentCert?.leaderTitle || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, leaderTitle: e.target.value }))}
            />
            <TextField
              label="Advisor Name"
              fullWidth
              value={currentCert?.advisorName || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, advisorName: e.target.value }))}
            />
            <TextField
              label="Advisor Title"
              fullWidth
              value={currentCert?.advisorTitle || ""}
              onChange={(e) => setCurrentCert((prev) => ({ ...prev!, advisorTitle: e.target.value }))}
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
