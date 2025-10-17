// "use client";

// import { useEffect, useState } from "react";

// interface Certificate {
//   _id: string;
//   name: string;
//   title: string;
//   description: string;
//   leaderName: string;
//   advisorName: string;
//   leaderTitle: string;
//   advisorTitle: string;
// }

// export default function CertificatesList() {
//   const [certificates, setCertificates] = useState<Certificate[]>([]);
//   const [loading, setLoading] = useState(false);

//   const fetchCertificates = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/certificates/fetch");
//       const data = await res.json();
//       if (data.success) setCertificates(data.certificates);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCertificate = async (id: string) => {
//     try {
//       const res = await fetch(`/api/certificates/delete/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (data.success) fetchCertificates();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCertificates();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Certificates</h1>

//       {loading && <p>Loading...</p>}

//       <ul className="space-y-2">
//         {certificates.map((cert) => (
//           <li key={cert._id} className="border p-4 rounded flex justify-between items-center">
//             <div>
//               <strong>{cert.name}</strong> - {cert.title}
//               <p className="text-sm">{cert.description}</p>
//             </div>
//             <div className="flex gap-2">
//               <button
//                 className="bg-red-500 text-white px-2 py-1 rounded"
//                 onClick={() => deleteCertificate(cert._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
