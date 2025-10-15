"use client";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Topbar from "@/app/assets/Untitled.png";
import Image from "next/image";
import JsBarcode from 'jsbarcode';
import { db, auth } from "@/app/lib/firebaseconfig";
import { doc, setDoc, collection } from 'firebase/firestore';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { IDCardPDF } from "@/app/components/idpdf";
import { motion } from "framer-motion";

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

const IDCard = React.forwardRef<HTMLDivElement, Person>((props, ref) => {
  const { name, role, idNumber, imageUrl, phone, email, DOB, address } = props;
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current && idNumber) {
      JsBarcode(barcodeRef.current, idNumber, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 40,
        displayValue: false,
        margin: 0
      });
    }
  }, [idNumber]);

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="w-[600px] bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200 relative" ref={ref}>
      {/* <!-- Top Bar --> */}
      <Image
        src={Topbar}
        alt="Reversed Image"
        className="absolute top-0 left-0 w-full h-48 transform -scale-x-100"
        priority
      />

      <div className="flex p-8 pt-20">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-extrabold text-[#0E1F47]"></h1>

          <div className="space-y-2 text-[#0E1F47] text-lg">
            <div className="flex">
              <span className="w-24 font-semibold">NAME</span>
              <span className="mx-2">:</span>
              <span className="font-medium">{name || "Full Name"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">Phone No.</span>
              <span className="mx-2">:</span>
              <span className="font-medium">{phone || "XXXXXXXXXX"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">E-Mail</span>
              <span className="mx-2">:</span>
              <span className="font-medium">{email || "youremail@gmail.com"}</span>
            </div>
            <div className="flex">
              <span className="w-24 font-semibold">D.O.B</span>
              <span className="mx-2">:</span>
              <span className="font-medium">
                {DOB ? formatDate(DOB) : "01/01/2000"}
              </span>
            </div>
            <div className="flex items-start">
              <span className="w-24 font-semibold">ADDRESS</span>
              <span className="mx-2">:</span>
              <span className="font-medium">
                {address || "123 Anywhere St., Any City"}
              </span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="font-bold text-xl">
              {role || "Manager"}
            </span>
          </div>
        </div>

        {/* <!-- Right Section --> */}
        <div className="flex flex-col items-end relative w-1/2">
          <div
            className="bg-[#5A8DBE] rounded-2xl w-[150px] h-[200px] mr-5 flex items-center justify-center overflow-hidden"
          >
            <img
              src={imageUrl || "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
              alt="profile"
              className="object-cover h-full w-full"
            />
          </div>
          <div className="mt-6 relative left-10">
            <svg ref={barcodeRef} className="h-5" />
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <span className="font-medium text-xl">{idNumber || "IDXXXX000XXX"}</span>
      </div>

      {/* <!-- Bottom Bar --> */}
      <div className="bg-[#F4B740] h-3 mb-2 w-full"></div>
      <div className="bg-[#0E1F47] h-3 w-full"></div>
    </div>
  );
});

IDCard.displayName = "IDCard";

//  Main Page
const IDCardPage: React.FC = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Person>({
    name: "",
    role: "",
    idNumber: "",
    phone: "",
    email: "",
    imageUrl: "",
    DOB: "",
    address: ""
  });

  //  Handle text fields or image base64 updates
  const handleChange = (field: keyof Person, value: string) => {
    setForm((prev) => {
      const updatedForm = { ...prev, [field]: value };

      // Whenever any relevant field changes, regenerate the ID number
      if (field === "name" || field === "phone" || field === "email") {
        updatedForm.idNumber = generateIDNumber(updatedForm);
      }

      return updatedForm;
    });
  };

  //  Generate the ID number
  const generateIDNumber = (formData: Person) => {
    const namePrefix = formData.name ? formData.name.slice(0, 3).toUpperCase() : "NON";
    const phonePrefix = formData.phone ? formData.phone.slice(-3) : "000";
    const DOBPrefix = formData.email
      ? formData.DOB.slice(-2)
      : "01";
    const rolePrefix = formData.role ? formData.role.slice(0, 2).toUpperCase() : "XX"

    return `ID${rolePrefix}${namePrefix}${phonePrefix}${DOBPrefix}`;
  };

  //  Handle file upload separately
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("imageUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  // handle save 

  const handleSave = async () => {
    const userId = auth.currentUser?.uid; // Get current authenticated user's ID
    if (!userId) {
      alert('❌ User is not authenticated');
      return;
    }

    const payload = {
      name: form.name,
      role: form.role,
      idNumber: form.idNumber,
      phone: form.phone,
      email: form.email,
      imageUrl: form.imageUrl,
      DOB: form.DOB,
      address: form.address,
    };

    try {
      const userRef = doc(db, 'users', userId); // Reference to the user's document
      const idCardsRef = collection(userRef, 'idCards'); // Subcollection for ID cards

      await setDoc(doc(idCardsRef, form.idNumber), payload); // Save the ID card data

      alert('✅ ID saved successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to save ID');
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100 p-8 gap-6">
      {/* Left Side - Always Visible ID Card */}
      <div className="flex-1 flex items-start justify-center">
        <IDCard ref={cardRef} {...form} />
      </div>

      {/* Right Side - Dynamic Form */}
      <div className="w-[320px] bg-white rounded-lg shadow-md p-4 border border-gray-200 space-y-4">
        <h3 className="text-lg font-semibold text-[#8B1C1C] mb-1">Create New ID</h3>
        <p className="text-sm text-gray-500 mt-2">
          👇 Type details below to see live preview on the left.
        </p>

        {/* Name, Role, ID Number, DOB, Address and Image Upload inputs */}
        <div className="flex flex-col space-y-1">
          <label className="font-semibold text-gray-700">Image URL</label>
          <div>
            <input
              accept="image/*"
              id="upload-image"
              type="file"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <label htmlFor="upload-image">
              <Button
                variant="contained"
                component="span"
                color="error"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  py: 1.2,
                  fontWeight: 600,
                }}
              >
                Upload Image
              </Button>
              <span className="text-red-600 text-sm">Image should be not greater than 1mb</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter full name"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">Role / Position</label>
          <input
            type="text"
            value={form.role}
            onChange={(e) => handleChange("role", e.target.value)}
            placeholder="Enter role"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">D.O.B</label>
          <input
            type="date"
            value={form.DOB}
            onChange={(e) => handleChange("DOB", e.target.value)}
            placeholder="D.O.B"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">Address</label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter Address"
            className="border p-2 rounded focus:outline-[#8B1C1C]"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="font-semibold text-gray-700">ID Number</label>
          <input
            type="text"
            value={form.idNumber}
            readOnly
            disabled
            className="border p-2 rounded focus:outline-[#8B1C1C] bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="flex flex-row gap-2 h-10">
          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Save ID
          </Button>


          <PDFDownloadLink
            document={<IDCardPDF {...form} />}
            fileName={`${form.name || "IDCard"}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <motion.button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  animate={{
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ⏳
                </motion.button>
              ) : (
                <button className="bg-[#0E1F47] text-white px-4 py-2 rounded hover:bg-[#132b6b] transition">
                  🖨 Download
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default IDCardPage;
