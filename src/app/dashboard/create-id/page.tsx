"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import Image from "next/image";
import dynamic from "next/dynamic";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Topbar from "@/app/assets/Untitled.png";
import JsBarcode from "jsbarcode";
import { IDCardPDF } from "@/app/components/idpdf";
import { ClientOnly } from "@/app/components/ClientOnly";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export interface Person {
  name?: string;
  role?: string;
  idNumber?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  DOB: string;
  address?: string;
}

// ----------------------------- ID Card Component -----------------------------
const IDCard = React.forwardRef<HTMLDivElement, Person>((props, ref) => {
  const { name, role, idNumber, imageUrl, phone, email, DOB, address } = props;
  const barcodeRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (barcodeRef.current && idNumber) {
      JsBarcode(barcodeRef.current, idNumber, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 40,
        displayValue: false,
        margin: 0,
      });
    }
  }, [idNumber]);

  const formatDate = (date: string) => {
    if (!date) return "01-01-2000";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <div
      ref={ref}
      className="w-[600px] bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 relative"
    >
      <Image
        src={Topbar}
        alt="Topbar"
        className="absolute top-0 left-0 w-full h-48 transform -scale-x-100"
        priority
      />

      <div className="flex p-8 pt-20">
        <div className="flex-1 space-y-4 text-[#0E1F47]">
          {[
            { label: "NAME", value: name || "Full Name" },
            { label: "Phone", value: phone || "XXXXXXXXXX" },
            { label: "E-Mail", value: email || "youremail@gmail.com" },
            { label: "D.O.B", value: formatDate(DOB) },
            { label: "ADDRESS", value: address || "123 Anywhere St." },
          ].map((item) => (
            <div key={item.label} className="flex items-start">
              <span className="w-24 font-semibold">{item.label}</span>
              <span className="mx-2">:</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
          <div className="flex items-start">
            <span className="font-bold text-xl">{role || "Manager"}</span>
          </div>
        </div>

        <div className="flex flex-col items-end relative w-1/2">
          <div className="bg-[#5A8DBE] rounded-2xl w-[150px] h-[200px] mr-5 overflow-hidden border-2 border-gray-300">
            <img
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80"
              }
              alt="profile"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="mt-6 relative left-10">
            <svg ref={barcodeRef} className="h-5" />
          </div>
        </div>
      </div>

      <div className="flex justify-center pb-3">
        <span className="font-medium text-xl">{idNumber || "IDXXXX000XXX"}</span>
      </div>

      <div className="bg-[#F4B740] h-3 w-full" />
      <div className="bg-[#0E1F47] h-3 w-full" />
    </div>
  );
});
IDCard.displayName = "IDCard";

// ----------------------------- Main Page -----------------------------
const IDCardPage: React.FC = () => {
  const [form, setForm] = useState<Person>({
    name: "",
    role: "",
    idNumber: "",
    phone: "",
    email: "",
    imageUrl: "",
    DOB: "",
    address: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ----------------- Generate ID Number -----------------
  const generateIDNumber = (data: Person) => {
    const namePrefix = data.name?.slice(0, 3).toUpperCase() || "NON";
    const phoneSuffix = data.phone?.slice(-3) || "000";
    return `ID${namePrefix}${phoneSuffix}`;
  };

  // ----------------- Handle Input Changes -----------------
  const handleChange = (field: keyof Person, value: string) => {
    const updated = { ...form, [field]: value };
    if (field === "name" || field === "phone") updated.idNumber = generateIDNumber(updated);
    setForm(updated);
  };

  // ----------------- Image Upload -----------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setForm((prev) => ({ ...prev, imageUrl: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  // ----------------- Save to Backend -----------------
  const handleSave = async () => {
    try {
      const res = await fetch("/api/create-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) alert("✅ ID Saved Successfully!");
    } catch (err) {
      alert("❌ Failed to save ID");
    }
  };

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gray-50 p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-[#0E1F47]">🪪 ID Card Creator</h1>
          <div className="flex gap-3">
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
            <PDFDownloadLink
              document={<IDCardPDF {...form} />}
              fileName={`ID_${form.idNumber || "Sample"}.pdf`}
            >
              {({ loading }) => (
                <Button variant="outlined" color="secondary">
                  {loading ? "Preparing PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
          {[
            { placeholder: "Name", field: "name" },
            { placeholder: "Role", field: "role" },
            { placeholder: "Phone", field: "phone" },
            { placeholder: "Email", field: "email" },
            { placeholder: "Date of Birth", field: "DOB", type: "date" },
            { placeholder: "Address", field: "address" },
          ].map((input) => (
            <input
              key={input.field}
              type={input.type || "text"}
              placeholder={input.placeholder}
              value={(form as any)[input.field]}
              onChange={(e) => handleChange(input.field as keyof Person, e.target.value)}
              className="border p-2 rounded"
            />
          ))}

          {/* Image Upload */}
          <div className="col-span-1 md:col-span-3">
            <input
              accept="image/*"
              id="upload-image"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-image" className="w-full">
              <Button
                variant="contained"
                component="span"
                color="error"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{ textTransform: "none", borderRadius: 2, py: 1.5, fontWeight: 600 }}
              >
                Upload Image
              </Button>
              <span className="text-red-600 text-sm">Image should not be greater than 1MB</span>
            </label>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex justify-center mt-10">
          <IDCard {...form} />
        </div>
      </div>
    </ClientOnly>
  );
};

export default IDCardPage;

