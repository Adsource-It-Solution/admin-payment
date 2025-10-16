"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import Image from "next/image";
import Topbar from "@/app/assets/Untitled.png";
import JsBarcode from "jsbarcode";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { IDCardPDF } from "@/app/components/idpdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export interface Person {
  name?: string;
  role?: string;
  idNumber?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  DOB: string;
  address: string;
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "01-01-2000";
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${date.getFullYear()}`;
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
          <div className="space-y-2 text-lg">
            <div className="flex">
              <span className="w-24 font-semibold">NAME</span>
              <span className="mx-2">:</span>
              <span className="font-medium">{name || "Full Name"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">Phone</span>
              <span className="mx-2">:</span>
              <span>{phone || "XXXXXXXXXX"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">E-Mail</span>
              <span className="mx-2">:</span>
              <span>{email || "youremail@gmail.com"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">D.O.B</span>
              <span className="mx-2">:</span>
              <span>{formatDate(DOB)}</span>
            </div>
            <div className="flex items-start">
              <span className="w-24 font-semibold">ADDRESS</span>
              <span className="mx-2">:</span>
              <span>{address || "123 Anywhere St."}</span>
            </div>
          </div>
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

  console.log(imagePreview)

  // ----------------- Save Function -----------------
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

  // ----------------- Image Upload Handler -----------------
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

  // ----------------- Input Changes -----------------
  const handleChange = (field: keyof Person, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      idNumber:
        field === "name" || field === "phone"
          ? generateIDNumber({ ...prev, [field]: value })
          : prev.idNumber,
    }));
  };

  const generateIDNumber = (data: Person) => {
    const namePrefix = data.name ? data.name.slice(0, 3).toUpperCase() : "NON";
    const phonePrefix = data.phone ? data.phone.slice(-3) : "000";
    return `ID${namePrefix}${phonePrefix}`;
  };

  // ----------------- UI -----------------
  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      <div className="flex justify-between items-center">
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
      <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={form.DOB}
          onChange={(e) => handleChange("DOB", e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => handleChange("address", e.target.value)}
          className="border p-2 rounded"
        />
        {/* Image Upload  */}
        <div>
          <input accept="image/*" id="upload-image" type="file" style={{ display: "none" }} onChange={handleImageUpload} />
          <label 
          htmlFor="upload-image">
             <Button variant="contained"
              component="span" 
              color="error"
               fullWidth
                startIcon={<CloudUploadIcon />}
            sx={{ textTransform: "none", borderRadius: "8px", py: 1.2, fontWeight: 600, }} >
            Upload Image
          </Button>
            <span className="text-red-600 text-sm">
              Image should be not greater than 1mb
            </span>
          </label>
        </div>
      </div>


      {/* Live Preview */ }
  <div className="flex justify-center mt-10">
    <IDCard {...form} />
  </div>
    </div >
  );
};

export default IDCardPage;
