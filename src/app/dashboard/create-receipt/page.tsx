"use client";
import { useEffect, useRef, useState } from 'react';
import {
  TextField,
  Grid,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
} from '@mui/material';
import { FaRupeeSign } from 'react-icons/fa';
import { Email, Home, Description, CreditCard, Receipt } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function CreateReceipt() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [transactionID, setTransactionID] = useState('TXN-89J4K2P1');
  const [date, setDate] = useState('2026-10-25');

  const receiptRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
    console.log("🧮 Recalculating total:", { quantity, unitPrice });
    if (quantity && unitPrice) {
      const total = quantity * parseFloat(unitPrice || "0");
      console.log("✅ Computed Total:", total);
      setTotalAmount(total.toFixed(2));
    }
  }, [quantity, unitPrice]);

  /* ==============================
     📅 Format Date
  ===============================*/
  const formatDate = (dateString: string) => {
    console.log("🗓 Formatting date:", dateString);
    if (!dateString) return "";
    const dateObj = new Date(dateString);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();

    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";

    return `${day}${suffix} ${month} ${year}`;
  };

  /* ==============================
     💾 Save to Backend
  ===============================*/
  const handleSaveToBackend = async () => {
    try {
      const payload = {
        name,
        contact,
        address,
        itemDescription,
        quantity,
        unitPrice,
        totalAmount,
        paymentMethod,
        transactionID,
        date,
      };

      console.log("📤 Sending payload to backend:", payload);

      const response = await fetch("/api/create-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📥 Raw response:", response);

      if (!response.ok) throw new Error("Failed to save receipt");

      const result = await response.json();
      console.log("✅ Backend response data:", result);

      alert("✅ Receipt data saved successfully!");
    } catch (error) {
      console.error("❌ Error saving receipt:", error);
      alert("❌ Failed to save receipt");
    }
  };

  /* ==============================
     📄 Download PDF
  ===============================*/
  const handleDownloadPDF = async () => {
    console.log("📄 Starting PDF download...");

    if (!receiptRef.current) {
      console.error("❌ Receipt reference not found!");
      return;
    }

    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      console.log("🖼 Canvas captured:", canvas);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`Receipt_${transactionID}.pdf`);
      console.log("✅ PDF downloaded successfully!");
    } catch (err) {
      console.error("❌ PDF generation failed:", err);
    }
  };

  return (
    <Box display="flex" justifyContent="space-around" gap={4} p={4} flexWrap="wrap">
      {/* ===== Left: Receipt View ===== */}
      <Card ref={receiptRef} sx={{ maxWidth: 600, bgcolor: '#faf1e6', border: '1px solid #e57373' }}>
        <Box bgcolor="error.main" color="white" px={4} py={2} display="flex" justifyContent="space-between">
          <Typography variant="h6" fontWeight="bold">
            Payment Receipt Invoice
          </Typography>
          <Box textAlign="right">
            <Typography variant="body2">+123-456-7890</Typography>
            <Typography variant="body2">www.reallygreatsite.com</Typography>
          </Box>
        </Box>

        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Info
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-2 font-semibold pr-4">Name:</td>
                <td>{name || 'Richard Sanchez'}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold pr-4">Contact:</td>
                <td>{contact || 'hello@reallygreatsite.com'}</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold pr-4">Address:</td>
                <td>{address || '123 Anywhere St., Any City, ST 12345'}</td>
              </tr>
            </tbody>
          </table>

          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-100 text-left">
                  <th className="py-2 px-2 border">Description</th>
                  <th className="py-2 px-2 border text-center">Qty</th>
                  <th className="py-2 px-2 border text-center">Unit Price</th>
                  <th className="py-2 px-2 border text-center">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-2 border">
                    {itemDescription || 'Annual Subscription for Premium Digital Marketing Tools'}
                  </td>
                  <td className="py-2 px-2 border text-center">{quantity}</td>
                  <td className="py-2 px-2 border text-center">
                    ₹ {unitPrice || '499.00'}
                  </td>
                  <td className="py-2 px-2 border text-center">
                    ₹ {totalAmount || '499.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </Box>

          <Box mt={3} display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6">Payment Details</Typography>
              <Typography>
                <strong>Method:</strong> {paymentMethod}
              </Typography>
              <Typography>
                <strong>Transaction ID:</strong> {transactionID}
              </Typography>
            </Box>
            <Box>
              <Typography variant="h6" color="error">
                Total Paid
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error">
                ₹ {totalAmount || '499.00'}
              </Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Typography variant="body2">
              Subscription valid until <strong>{formatDate(date)}</strong>.
            </Typography>
            <Typography variant="body2">
              For support: <strong>hello@reallygreatsite.com</strong> | +123-456-7890
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Right: Form ===== */}
      <Card sx={{ maxWidth: 400, p: 3 }}>
        <Typography variant="h5" gutterBottom
          sx={{
            borderRadius: 2
          }}
          bgcolor="error.main" color="white" px={4} py={2} display="flex" justifyContent="space-between">
          Enter Receipt Information
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Receipt />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Item Description"
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Description />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <Grid container spacing={2}>
            <TextField
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              variant="outlined"
              fullWidth
            />
            <TextField
              label="Unit Price"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaRupeeSign />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>

          <TextField
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCard />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Transaction ID"
            value={transactionID}
            onChange={(e) => setTransactionID(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Receipt />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />

          <TextField
            label="Subscription Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            fullWidth
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="error" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveToBackend}>
              Save Pdf
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default CreateReceipt;
