import { useState, useEffect } from 'react';
import { db } from '../../lib/firebaseconfig'; // Import Firestore setup
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore'; // Firestore functions
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface CertificateForm {
  id: string;
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
}

export default function Certificatelist() {
  const [certificates, setCertificates] = useState<CertificateForm[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateForm | null>(null); // To store selected certificate for update
  const [openDialog, setOpenDialog] = useState(false); // Dialog state for editing

  // Fetch certificates from Firestore
  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    const userId = "userId123";
    const certificatesRef = collection(db, "users", userId, "certificates");
    const querySnapshot = await getDocs(certificatesRef);
    
    const certsData: CertificateForm[] = [];
    querySnapshot.forEach((doc) => {
      certsData.push({ ...doc.data(), id: doc.id } as CertificateForm);
    });

    setCertificates(certsData);
  };

  // Handle Delete Certificate
  const handleDelete = async (certificateId: string) => {
    try {
      const certificateRef = doc(db, "users", "userId123", "certificates", certificateId);
      await deleteDoc(certificateRef);
      alert("✅ Certificate deleted!");
      fetchCertificates(); // Fetch updated data after deletion
    } catch (error) {
      console.error("Error deleting certificate:", error);
      alert("❌ Failed to delete certificate");
    }
  };

  // Handle Update Certificate
  const handleUpdate = async () => {
    if (!selectedCertificate) return;

    const certificateRef = doc(db, "users", "userId123", "certificates", selectedCertificate.id);
    try {
      await updateDoc(certificateRef, selectedCertificate as Record<string, any>); 
      alert("✅ Certificate updated!");
      fetchCertificates(); 
      setOpenDialog(false);
    } catch (error) {
      console.error("Error updating certificate:", error);
      alert("❌ Failed to update certificate");
    }
  };

  // Open the dialog for editing the selected certificate
  const handleEdit = (certificate: CertificateForm) => {
    setSelectedCertificate(certificate);
    setOpenDialog(true);
  };

  const handleDialogChange = (field: keyof CertificateForm, value: string) => {
    if (selectedCertificate) {
      setSelectedCertificate({
        ...selectedCertificate,
        [field]: value,
      });
    }
  };

  // Render certificates
  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Saved Certificates</h2>

      <div>
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white p-4 mb-4 rounded-md shadow-md">
            <h3 className="text-xl font-bold">{certificate.name}</h3>
            <p>{certificate.description}</p>
            <div className="mt-2 flex gap-4">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEdit(certificate)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleDelete(certificate.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for Editing Certificate */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Certificate</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <TextField
              label="Name"
              fullWidth
              value={selectedCertificate?.name || ""}
              onChange={(e) => handleDialogChange("name", e.target.value)}
            />
            <TextField
              label="Title"
              fullWidth
              value={selectedCertificate?.title || ""}
              onChange={(e) => handleDialogChange("title", e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              value={selectedCertificate?.description || ""}
              onChange={(e) => handleDialogChange("description", e.target.value)}
            />
            <TextField
              label="Leader Name"
              fullWidth
              value={selectedCertificate?.leaderName || ""}
              onChange={(e) => handleDialogChange("leaderName", e.target.value)}
            />
            <TextField
              label="Advisor Name"
              fullWidth
              value={selectedCertificate?.advisorName || ""}
              onChange={(e) => handleDialogChange("advisorName", e.target.value)}
            />
            <TextField
              label="Leader Title"
              fullWidth
              value={selectedCertificate?.leaderTitle || ""}
              onChange={(e) => handleDialogChange("leaderTitle", e.target.value)}
            />
            <TextField
              label="Advisor Title"
              fullWidth
              value={selectedCertificate?.advisorTitle || ""}
              onChange={(e) => handleDialogChange("advisorTitle", e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
