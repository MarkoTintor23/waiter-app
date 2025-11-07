"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Homepage() {
  const [waiter, setWaiter] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const savedWaiter = localStorage.getItem("waiter");
    if (savedWaiter) {
      Promise.resolve().then(() => setWaiter(savedWaiter));
    }
  }, []);

  const handleEnter = () => {
    if (!waiter) return alert("Izaberi konobara!");
    localStorage.setItem("waiter", waiter);
    router.push("/tables");
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Izaberi konobara</h1>
      <select
        value={waiter}
        onChange={(e) => setWaiter(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="">-- Izaberi ime --</option>
        <option value="Mina">Mina</option>
        <option value="Luka">Luka</option>
        <option value="Ana">Ana</option>
      </select>
      <button
        onClick={handleEnter}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Uđi
      </button>
    </main>
  );
}
