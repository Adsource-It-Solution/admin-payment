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
import {
  Email,
  Home,
  Description,
  CreditCard,
  Receipt,
  LocalPhone
} from "@mui/icons-material";
import dynamic from "next/dynamic";
import { ClientOnly } from "@/app/components/ClientOnly";
import ReceiptPDFDocument from "@/app/components/ReceiptPDFDocument";
import { ReceiptDocument } from "@/app/pdf/receipt";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);



export type transaction = {
  receiptNo: string;
  name: string;
  contact: string;
  mobile: string;
  address: string;
  itemDescription: string;
  unitPrice: string;
  totalAmount: string;
  paymentMethod: string;
  pan: string;
  transactionID: string;
  date: string;
}

const today = new Date();
const DEFAULT_DATE = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;


function transaction() {
  const [form, setForm] = useState({
    receiptNo: "",
    name: "",
    contact: "",
    mobile: "",
    address: "",
    itemDescription: "",
    quantity: 1,
    unitPrice: "",
    totalAmount: "",
    paymentMethod: "",
    pan: "",
    transactionID: "",
    date: DEFAULT_DATE,
  });
  const [receiptNo, setReceiptNo] = useState("");
  const receiptRef = useRef<HTMLDivElement>(null);
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);


  useEffect(() => {
    const uniqueNumber = `HET_${Math.floor(100000 + Math.random() * 900000)}`;
    setForm((prev) => ({ ...prev, receiptNo: uniqueNumber }));
  }, []);
  

  useEffect(() => {
    if (form.quantity && form.unitPrice) {
      const total = form.quantity * parseFloat(form.unitPrice || "0");
      setForm((prev) => ({ ...prev, totalAmount: total.toFixed(2) }));
    }
  }, [form.quantity, form.unitPrice]);

  const handleChange = (field: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDownloadPdf = async () => {
    try {
      setLoadingPdf(true);

      // ✅ Use form data instead of transaction
      const blob = await pdf(<ReceiptDocument transaction={form} />).toBlob();
      saveAs(blob, `Receipt_${form.transactionID || "draft"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setLoadingPdf(false);
    }
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
      <Box px={{ xs: 2, sm: 4 }} py={4}>
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="flex-start"
        >
          {/* =================== RECEIPT PREVIEW =================== */}

          <Card
            ref={receiptRef}
            sx={{
              width: "100%",
              maxWidth: 800,
              mx: "auto",
              mt: 4,
              border: "2px solid #009688",
              borderRadius: 2,
              bgcolor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            {/* Header Section */}
            <div className="flex flex-row px-10 py-4 bg-[#ECF4E8] border-b-2 rounded-b-md">
              <div>
                <img src="/logo-pdf.png" alt="Health and Eductation Trust" className="w-72 h-16" />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                  REGD NO: 568/2025
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                  NGO DARPAN ID- UP/2025/0820407
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                  PAN NO: AADTH3780K
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                  ALL DONATIONS ARE EXEMPTED U/S 80G OF
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: "bold" }}>
                  INCOME TAX ACT, 1961
                </Typography>

              </div>

            </div>

            {/* Title */}
            <Box textAlign="center" py={2}>
              <Typography variant="h6" fontWeight="bold" color="teal">
                Donation Receipt
              </Typography>
            </Box>

            <CardContent sx={{ px: 4, pb: 4 }}>
              {/* Receipt No & Date */}
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Receipt No:   {form.receiptNo}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="bold">
                    Date:   {form.date}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Donor Info Rows */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Donor Name:  {form.name}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="bold">
                    Email:   {form.contact}
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Donation for:   {form.itemDescription}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    Amount (in words):   ₹ {form.totalAmount} /-
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="bold">
                    Mobile No:   {form.mobile}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Payment Mode:   {form.paymentMethod}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="bold">
                    Address:   {form.address}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Transaction Id:   {form.transactionID}
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="body2" fontWeight="bold">
                    PAN No:   {form.pan}
                  </Typography>
                </Box>
              </Box>

              <Box mt={3}>
                <Typography variant="body2">
                  Thank you so much for contributing to <span className="font-bold">Heath and Education Trust</span>.
                </Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary">
                  NOTE: Your donation
                  benefits food, clothing, education, and healthcare for underprivileged children.
                  Donations are exempted under Section 80G of the Income Tax Act, 1961.
                </Typography>
                <Typography variant="body2" color="text.secondary">Please keep this receipt as acknowledgment of your contribution.</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Footer Section */}

              <div className="flex justify-center flex-col items-center">
                <span className="font-bold text-2xl text-purple-700">
                  HEALTH AND EDUCATION TRUST
                </span>
                <div className="border-2 border-y-cyan-600 border-x-cyan-700 px-5 py-5 rounded-2xl">
                  <img src="/sign.png" alt="" className="w-44 h-24" />
                </div>
              </div>


              <Divider sx={{ my: 3 }} />
              <p className="font-bold text-2xl text-teal-700 text-center">Contact Us</p>
              <Box textAlign="left">
                <Typography variant="body2" color="text.secondary">
                  📞 +91 88514 59880
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📧 info@healthandeducationtrust.org
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍C-59, C Block, 3rd Floor Sect-2, Noida-201301
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🌐 www.healthandeducationtrust.org
                </Typography>
              </Box>
            </CardContent>
          </Card>


          {/* =================== INPUT FORM =================== */}
          <Card sx={{ p: 3, width: "100%" }}>
            <Typography
              variant="h5"
              gutterBottom
              bgcolor="error.main"
              color="white"
              px={3}
              py={2}
              borderRadius={2}
            >
              Enter Receipt Information
            </Typography>

            <Grid container spacing={2}>
              <TextField
                label="Receipt No."
                type="text"
                value={form.receiptNo}
                onChange={(e) => handleChange("receiptNo", e.target.value)}
                variant="outlined"
                fullWidth
                disabled // 👈 keep disabled if you don’t want manual edits
              />
            </Grid>


            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              {[
                { label: "Name", icon: <Receipt />, value: form.name, field: "name" },
                { label: "Pan Card", icon: <CreditCard />, value: form.pan, field: "pan" },
                { label: "Email", icon: <Email />, value: form.contact, field: "contact" },
                { label: "Phone No.", icon: <LocalPhone />, value: form.mobile, field: "mobile" },
                { label: "Address", icon: <Home />, value: form.address, field: "address" },
                { label: "Donation For", icon: <Description />, value: form.itemDescription, field: "itemDescription" },
                { label: "Payment Via", icon: <CreditCard />, value: form.paymentMethod, field: "paymentMethod" },
                { label: "Transaction ID", icon: <Receipt />, value: form.transactionID, field: "transactionID" },
              ].map((input) => (
                <TextField
                  key={input.field}
                  label={input.label}
                  value={input.value}
                  onChange={(e) =>
                    handleChange(
                      input.field as keyof typeof form,
                      e.target.value
                    )
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {input.icon}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  fullWidth
                />
              ))}

              <Grid container spacing={2}>
                <TextField
                  label="Amount"
                  type="number"
                  value={form.totalAmount}
                  onChange={(e) =>
                    handleChange("totalAmount", e.target.value)
                  }
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
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                fullWidth
              />

              <Grid container spacing={2}>
                {/* <PDFDownloadLink
                  document={<ReceiptPDFDocument {...form} />}
                  fileName={`Receipt_${form.transactionID}.pdf`}
                  style={{ textDecoration: "none", width: "100%" }}
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
                </PDFDownloadLink> */}
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ py: 1.5 }}
                  onClick={handleDownloadPdf}>
                  {loadingPdf ? "⏳ Generating..." : "Download PDF"}
                </Button>
                {/* <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ py: 1.5 }}
                  onClick={handleSaveToBackend}
                >
                  Save PDF
                </Button> */}
              </Grid>
            </Box>
          </Card>

        </Grid>
      </Box>

    </ClientOnly>
  );
}

export default transaction;
