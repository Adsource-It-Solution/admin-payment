"use client";

import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import Image from "next/image";
import medal from "@/app/assets/medal.png";
import corner from "@/app/assets/corner.png";
import bottomimage from "@/app/assets/bottomimage.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CertificatePDF } from "@/app/components/certificatepdf";
import { log } from "console";

interface CertificateForm {
  name: string;
  title: string;
  description: string;
  leaderName: string;
  advisorName: string;
  leaderTitle: string;
  advisorTitle: string;
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
  });

  const [savedCertificates, setSavedCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);
  const userId = "userId123";

  const handleChange = (field: keyof CertificateForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  console.log(savedCertificates)

  /* ======================================================
     💾 Save Certificate
  ====================================================== */
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...formData }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("✅ Certificate saved successfully!");
        fetchCertificates();
      } else {
        toast.error("❌ Failed to save certificate");
      }
    } catch (error) {
      console.error("handleSave -> error:", error);
      toast.error("❌ Server error while saving");
    } finally {
      setLoading(false);
    }
  };

  /* ======================================================
     📄 Fetch Certificates
  ====================================================== */
const fetchCertificates = async () => {
  try {
    const res = await fetch(`/api/certificates?userId=${userId}`);
    const data = await res.json();
    if (data.success) {
      setSavedCertificates(data.data || []); // ✅ Fix: use `data.data`
    } else {
      toast.error("❌ Failed to fetch certificates");
      setSavedCertificates([]); // avoid undefined
    }
  } catch (error) {
    console.error("fetchCertificates -> error:", error);
    setSavedCertificates([]); // ensure it's always an array
  }
};


  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-gray-100 min-h-screen relative">
      {/* Loader overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ==== Certificate Preview ==== */}
      <div
        ref={certRef}
        className="relative max-w-2xl w-full bg-white shadow-2xl rounded-xl overflow-hidden border-4 border-[#0E1F47] flex flex-col items-center text-center"
      >
        <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
          <Image
            src={corner}
            alt="Corner"
            width={96}
            height={96}
            className="absolute top-0 left-0 w-24 h-24"
          />
          <Image
            src={corner}
            alt="Corner"
            width={96}
            height={96}
            className="absolute top-0 right-0 w-24 h-24 rotate-90"
          />
          <Image src={bottomimage} alt="Bottom" className="absolute bottom-0 right-0" />
        </div>

        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
          <Image src={medal} alt="Medal" width={64} height={64} className="w-16 h-16" />
        </div>

        <h1 className="mt-28 text-4xl font-bold text-[#0E1F47] uppercase tracking-wide">
          {formData.title}
        </h1>
        <p className="text-xl text-gray-700 mt-4">Presented to</p>
        <h2 className="text-4xl font-extrabold text-[#0E1F47] mt-2 tracking-wide">
          {formData.name}
        </h2>
        <p className="relative left-14 w-4/5 text-gray-800 mt-6 text-lg leading-relaxed">
          {formData.description}
        </p>

        <div className="flex justify-around w-full max-w-3xl px-10 mt-40">
          <div className="text-center w-1/3 relative bottom-12">
            <hr className="border-gray-500 mb-2 mx-auto w-2/3" />
            <span className="block text-sm font-semibold text-gray-800">
              {formData.leaderName}
            </span>
            <span className="text-xs text-gray-500">{formData.leaderTitle}</span>
          </div>
          <div className="text-center w-1/3 relative bottom-12">
            <hr className="border-gray-500 mb-2 mx-auto w-2/3" />
            <span className="block text-sm font-semibold text-gray-800">
              {formData.advisorName}
            </span>
            <span className="text-xs text-gray-500">{formData.advisorTitle}</span>
          </div>
        </div>
      </div>

      {/* ==== Form Section ==== */}
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-[#0E1F47]">✍ Create Certificate</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Leader Name"
            className="w-1/2 border p-2 rounded"
            value={formData.leaderName}
            onChange={(e) => handleChange("leaderName", e.target.value)}
          />
          <input
            type="text"
            placeholder="Advisor Name"
            className="w-1/2 border p-2 rounded"
            value={formData.advisorName}
            onChange={(e) => handleChange("advisorName", e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Leader Title"
            className="w-1/2 border p-2 rounded"
            value={formData.leaderTitle}
            onChange={(e) => handleChange("leaderTitle", e.target.value)}
          />
          <input
            type="text"
            placeholder="Advisor Title"
            className="w-1/2 border p-2 rounded"
            value={formData.advisorTitle}
            onChange={(e) => handleChange("advisorTitle", e.target.value)}
          />
        </div>

        <div className="flex gap-2 mt-4">
          <PDFDownloadLink
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
            {({ loading }) =>
              loading ? (
                <button className="flex-1 bg-gray-300 py-2 rounded">⏳ Generating...</button>
              ) : (
                <button className="flex-1 bg-[#0E1F47] text-white py-2 rounded hover:bg-[#132b6b] transition">
                  🖨 Download PDF
                </button>
              )
            }
          </PDFDownloadLink>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
          >
            💾 Save
          </button>
        </div>
      </div>
    </div>
  );
}
