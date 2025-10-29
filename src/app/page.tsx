"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebaseconfig";
import { ClientOnly } from "@/app/components/ClientOnly";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; 

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_REQUIRE!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Check credentials first (before calling Firebase)
    if (email.trim() !== ADMIN_EMAIL || password.trim() !== ADMIN_PASSWORD) {
      setError("Access denied: Unauthorized credentials");
      setLoading(false);
      return;
    }

    try {
      // Firebase login (admin user must exist in Firebase)
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard/create-receipt"); // redirect to admin dashboard
    } catch (err: any) {
      console.error(err);
      setError("Login failed: Invalid credentials or Firebase error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientOnly>

      <div className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{
        backgroundImage: "url('/background.jpg')",   
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#000", 
        width: "100vw",
        height: "100vh"
      }}>
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </ClientOnly>
  );
}
