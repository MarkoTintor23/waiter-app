"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Table = {
  id: number;
  status: "prazno" | "otvoreno" | "placeno";
};

export default function TablesPage() {
  const router = useRouter();

  const [tables, setTables] = useState<Table[]>(
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      status: "prazno",
    }))
  );

  useEffect(() => {
    const saved = localStorage.getItem("tablesState");
    if (saved) setTables(JSON.parse(saved));
  }, []);

  const handleTableClick = (table: Table) => {
    const newTables = [...tables];
    if (table.status === "prazno") {
      newTables[table.id - 1].status = "otvoreno";
    } else if (table.status === "otvoreno") {
    } else if (table.status === "placeno") {
      newTables[table.id - 1].status = "prazno";
    }

    setTables(newTables);
    localStorage.setItem("tablesState", JSON.stringify(newTables));

    router.push(`/order/${table.id}`);
  };

  const getColor = (status: Table["status"]) => {
    switch (status) {
      case "prazno":
        return "bg-gray-400";
      case "otvoreno":
        return "bg-orange-400";
      case "placeno":
        return "bg-green-400";
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Izaberi sto</h1>

      <div className="grid grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`${getColor(
              table.status
            )} h-24 flex items-center justify-center cursor-pointer text-white font-bold rounded`}
          >
            Sto {table.id}
          </div>
        ))}
      </div>
    </main>
  );
}
