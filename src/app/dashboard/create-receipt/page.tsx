"use client";

import { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import { FaRupeeSign } from "react-icons/fa";
import { Email, Home, Description, CreditCard, Receipt } from "@mui/icons-material";
import dynamic from "next/dynamic";
import { ClientOnly } from "@/app/components/ClientOnly";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

import ReceiptPDFDocument from "@/app/components/ReceiptPDFDocument";

const DEFAULT_TRANSACTION_ID = "TXN-89J4K2P1";
const DEFAULT_DATE = "2026-10-25";

function CreateReceipt() {
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    itemDescription: "",
    quantity: 1,
    unitPrice: "",
    totalAmount: "",
    paymentMethod: "Credit Card",
    transactionID: DEFAULT_TRANSACTION_ID,
    date: DEFAULT_DATE,
  });

  const receiptRef = useRef<HTMLDivElement>(null);

  // Recalculate total when quantity or unit price changes
  useEffect(() => {
    if (form.quantity && form.unitPrice) {
      const total = form.quantity * parseFloat(form.unitPrice || "0");
      setForm((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
    }
  }, [form.quantity, form.unitPrice]);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
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

  const handleSaveToBackend = async () => {
    try {
      const response = await fetch("/api/create-receipt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to save receipt");
      await response.json();
      alert("✅ Receipt saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save receipt");
    }
  };

  return (
    <ClientOnly>
      <Box display="flex" flexWrap="wrap" gap={4} p={4} justifyContent="center">
        {/* ===== Receipt Preview ===== */}
        <Card
          ref={receiptRef}
          sx={{ maxWidth: 600, bgcolor: "#faf1e6", border: "1px solid #e57373" }}
        >
          <Box
            bgcolor="error.main"
            color="white"
            px={4}
            py={2}
            display="flex"
            justifyContent="space-between"
          >
            <Typography variant="h6" fontWeight="bold">
              Payment Receipt Invoice
            </Typography>
            <Box textAlign="right">
              <Typography variant="body2">+123-456-7890</Typography>
              <Typography variant="body2">www.reallygreatsite.com</Typography>
            </Box>
          </Box>

          <CardContent>
            {/* Customer Info */}
            <Typography variant="h6" gutterBottom>
              Customer Info
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="py-2 font-semibold pr-4">Name:</td>
                  <td>{form.name || "Richard Sanchez"}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold pr-4">Contact:</td>
                  <td>{form.contact || "hello@reallygreatsite.com"}</td>
                </tr>
                <tr>
                  <td className="py-2 font-semibold pr-4">Address:</td>
                  <td>{form.address || "123 Anywhere St., Any City, ST 12345"}</td>
                </tr>
              </tbody>
            </table>

            {/* Item Description */}
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
                    <td className="py-2 px-2 border">{form.itemDescription || "Annual Subscription for Premium Tools"}</td>
                    <td className="py-2 px-2 border text-center">{form.quantity}</td>
                    <td className="py-2 px-2 border text-center">₹ {form.unitPrice || "499.00"}</td>
                    <td className="py-2 px-2 border text-center">₹ {form.totalAmount || "499.00"}</td>
                  </tr>
                </tbody>
              </table>
            </Box>

            {/* Payment Details */}
            <Box mt={3} display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6">Payment Details</Typography>
                <Typography>
                  <strong>Method:</strong> {form.paymentMethod}
                </Typography>
                <Typography>
                  <strong>Transaction ID:</strong> {form.transactionID}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h6" color="error">
                  Total Paid
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="error">
                  ₹ {form.totalAmount || "499.00"}
                </Typography>
              </Box>
            </Box>

            <Box mt={3}>
              <Typography variant="body2">
                Subscription valid until <strong>{formatDate(form.date)}</strong>.
              </Typography>
              <Typography variant="body2">
                For support: <strong>hello@reallygreatsite.com</strong> | +123-456-7890
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* ===== Input Form ===== */}
        <Card sx={{ maxWidth: 400, p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            bgcolor="error.main"
            color="white"
            px={4}
            py={2}
            borderRadius={2}
          >
            Enter Receipt Information
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {[
              { label: "Name", icon: <Receipt />, value: form.name, field: "name" },
              { label: "Contact", icon: <Email />, value: form.contact, field: "contact" },
              { label: "Address", icon: <Home />, value: form.address, field: "address" },
              { label: "Item Description", icon: <Description />, value: form.itemDescription, field: "itemDescription" },
              { label: "Payment Method", icon: <CreditCard />, value: form.paymentMethod, field: "paymentMethod" },
              { label: "Transaction ID", icon: <Receipt />, value: form.transactionID, field: "transactionID" },
            ].map((input) => (
              <TextField
                key={input.field}
                label={input.label}
                value={input.value}
                onChange={(e) => handleChange(input.field as keyof typeof form, e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start">{input.icon}</InputAdornment> }}
                variant="outlined"
                fullWidth
              />
            ))}

            <Grid container spacing={2}>
              <TextField
                label="Quantity"
                type="number"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
                variant="outlined"
                fullWidth
              />
              <TextField
                label="Unit Price"
                type="number"
                value={form.unitPrice}
                onChange={(e) => handleChange("unitPrice", e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><FaRupeeSign /></InputAdornment> }}
                variant="outlined"
                fullWidth
              />
            </Grid>

            <TextField
              label="Subscription Date"
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              fullWidth
            />

            <Box display="flex" justifyContent="space-between" mt={2} gap={2}>
              {/* PDF Download Wrapper */}
              <PDFDownloadLink
                document={<ReceiptPDFDocument {...form} />}
                fileName={`Receipt_${form.transactionID}.pdf`}
                style={{ textDecoration: "none", flex: 1 }}
              >
                {({ loading }) => (
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    {loading ? "⏳ Generating..." : "Download PDF"}
                  </Button>
                )}
              </PDFDownloadLink>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ py: 1.5 }}
                onClick={handleSaveToBackend}
              >
                Save PDF
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </ClientOnly>
  );
}

export default CreateReceipt;
