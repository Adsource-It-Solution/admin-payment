"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CertificatePDF } from "@/app/components/certificatepdf";
import PDFDownloadWrapper from "@/app/components/PDFDownloadWrapper";
import { ClientOnly } from "@/app/components/ClientOnly";
import medal from "@/app/assets/medal.png";
import corner from "@/app/assets/corner.png";
import bottomimage from "@/app/assets/bottomimage.png";
import logo from "@/app/assets/logo-pdf.png";
import defaultSign from "@/app/assets/signature.jpg";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export const dynamic = "force-dynamic";

interface CertificateForm {
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
  headSign: string;
  advisorSign: string;
}

export default function CertificateEditor() {
  const [formData, setFormData] = useState<CertificateForm>({
    name: "JULIANA SILVA",
    title: "Certificate of Membership",
    description:
      "To certify membership in Really Great Club and is entitled to all rights therein.",
    leaderName: "BAILEY DUPONT",
    advisorName: "AVERY DAVIS",
    leaderTitle: "Community Leader",
    advisorTitle: "Community Advisor",
    headSign: defaultSign.src,
    advisorSign: defaultSign.src,
  });

  const [savedCertificates, setSavedCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = "userId123";

  const handleChange = (field: keyof CertificateForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "headSign" | "advisorSign"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // const handleSave = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch("/api/certificates", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ userId, ...formData }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       toast.success("✅ Certificate saved successfully!");
  //       fetchCertificates();
  //     } else toast.error("❌ Failed to save certificate");
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("❌ Server error while saving");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCertificates = async () => {
    try {
      const res = await fetch(`/api/certificates?userId=${userId}`);
      const data = await res.json();
      if (data.success) setSavedCertificates(data.data || []);
      else setSavedCertificates([]);
    } catch (err) {
      console.error(err);
      setSavedCertificates([]);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <ClientOnly>
      <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100 min-h-screen relative">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={2000} />

        {/* ===== Certificate Preview ===== */}
        <div className="relative max-w-2xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border-4 border-[#0E1F47] flex flex-col items-center text-center p-4">
          {/* Decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <Image src={corner} alt="corner" width={96} height={96} className="absolute top-0 left-0 w-24 h-24" />
            <Image src={corner} alt="corner" width={96} height={96} className="absolute top-0 right-0 w-24 h-24 rotate-90" />
            <Image src={bottomimage} alt="bottom" className="absolute bottom-0 right-0" />
          </div>

          <Image src={logo} alt="Health & Education Trust" className="w-[300px] h-[80px] mt-10" />

          <h1 className="mt-4 text-4xl font-bold text-[#0E1F47] uppercase tracking-wide">
            {formData.title}
          </h1>

          <div className="relative bg-white rounded-full p-3 shadow-lg mt-2">
            <Image src={medal} alt="medal" width={64} height={64} />
          </div>

          <p className="text-xl text-gray-700 mt-4">Presented to</p>
          <h2 className="text-4xl font-extrabold text-[#0E1F47] mt-2 tracking-wide">
            {formData.name}
          </h2>
          <p className="w-4/5 mx-auto text-gray-800 mt-6 text-lg leading-relaxed">
            {formData.description}
          </p>

          {/* Signatures */}
          <div className="flex justify-around w-full max-w-3xl px-14 mt-4 mb-4">
            <div className="text-center w-1/3">
              <Image
                src={formData.headSign || defaultSign.src}
                alt={formData.leaderName}
                width={100}
                height={50}
                className="mx-auto object-contain"
                unoptimized
              />
              <span className="block text-sm font-semibold text-gray-800 mt-2">
                {formData.leaderName}
              </span>
              <span className="text-xs text-gray-500">{formData.leaderTitle}</span>
            </div>
            <div className="text-center w-1/3">
              <Image
                src={formData.advisorSign || defaultSign.src}
                alt={formData.advisorName}
                width={100}
                height={50}
                className="mx-auto object-contain"
                unoptimized
              />
              <span className="block text-sm font-semibold text-gray-800 mt-2">
                {formData.advisorName}
              </span>
              <span className="text-xs text-gray-500">{formData.advisorTitle}</span>
            </div>
          </div>
        </div>

        {/* ===== Form Section ===== */}
        <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg space-y-4 border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-[#0E1F47]">✍ Create Certificate</h2>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Recipient Name"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <input
              type="text"
              placeholder="Certificate Title"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Leader */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="Leader Name"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
                value={formData.leaderName}
                onChange={(e) => handleChange("leaderName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Leader Title"
                className="w-full border p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
                value={formData.leaderTitle}
                onChange={(e) => handleChange("leaderTitle", e.target.value)}
              />
              <div className="col-span-1 md:col-span-3 space-y-2">
              <label className="block mt-3 text-sm text-gray-600 font-medium">Head Signature</label>
                <input
                  accept="image/*"
                  id="leader-sign-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, "headSign")}
                />
                <label htmlFor="leader-sign-upload" className="w-full flex flex-col items-center">
                  <Button
                    variant="contained"
                    component="span"
                    color="error"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Upload Leader Signature
                  </Button>
                </label>
              </div>
            </div>

            {/* Advisor */}
            <div>
              <input
                type="text"
                placeholder="Advisor Name"
                className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
                value={formData.advisorName}
                onChange={(e) => handleChange("advisorName", e.target.value)}
              />
              <input
                type="text"
                placeholder="Advisor Title"
                className="w-full border p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0E1F47]"
                value={formData.advisorTitle}
                onChange={(e) => handleChange("advisorTitle", e.target.value)}
              />
              <label className="block mt-3 text-sm text-gray-600 font-medium">Advisor Signature</label>
              <div className="col-span-1 md:col-span-3 space-y-2">
                <input
                  accept="image/*"
                  id="advisor-sign-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={(e) => handleImageUpload(e, "advisorSign")}
                />
                <label htmlFor="advisor-sign-upload" className="w-full flex flex-col items-center">
                  <Button
                    variant="contained"
                    component="span"
                    color="error"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 600,
                    }}
                  >
                    Upload Advisor Signature
                  </Button>
                </label>
              </div>
            </div>
          </div>

          {/* PDF & Save Buttons */}
          <div className="flex gap-3 mt-6">
            <PDFDownloadWrapper
              document={
                <CertificatePDF
                  {...formData}
                  medal={medal.src}
                  corner={corner.src}
                  bottomimage={bottomimage.src}
                />
              }
              fileName={`${formData.name}-certificate.pdf`}
            >
              {({ loading }) => (
                <button className="flex-1 bg-[#0E1F47] text-white py-2 px-5 rounded-md font-semibold hover:bg-[#132b6b] transition">
                  {loading ? "⏳ Generating..." : "🖨 Download PDF"}
                </button>
              )}
            </PDFDownloadWrapper>
{/* 
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-gray-200 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              💾 Save
            </button> */}
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
