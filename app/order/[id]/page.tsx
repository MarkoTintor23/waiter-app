"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type MenuItem = {
  name: string;
  price: number;
};

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  note: string;
};

type Table = {
  id: number;
  status: string;
};

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [waiter, setWaiter] = useState<string>("");
  const [order, setOrder] = useState<OrderItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);

  const menu: Record<string, MenuItem[]> = {
    pice: [
      { name: "Kafa", price: 180 },
      { name: "Sok", price: 200 },
      { name: "Pivo", price: 250 },
    ],
    hrana: [
      { name: "Pizza", price: 700 },
      { name: "Pasta", price: 600 },
      { name: "Sendvič", price: 400 },
    ],
    desert: [
      { name: "Kolač", price: 350 },
      { name: "Sladoled", price: 300 },
      { name: "Palačinke", price: 400 },
    ],
  };

  useEffect(() => {
    const savedWaiter = localStorage.getItem("waiter");
    if (savedWaiter) setWaiter(savedWaiter);

    const savedTables = localStorage.getItem("tablesState");
    if (savedTables) setTables(JSON.parse(savedTables));

    const savedOrder = localStorage.getItem(`order_${id}`);
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, [id]);

  const addItem = (item: MenuItem) => {
    const existing = order.find((i) => i.name === item.name);
    let newOrder: OrderItem[];

    if (existing) {
      newOrder = order.map((i) =>
        i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      newOrder = [...order, { ...item, quantity: 1, note: "" }];
    }

    setOrder(newOrder);
    localStorage.setItem(`order_${id}`, JSON.stringify(newOrder));
  };

  const updateQuantity = (name: string, delta: number) => {
    const newOrder = order
      .map((i) =>
        i.name === name
          ? { ...i, quantity: Math.max(i.quantity + delta, 1) }
          : i
      )
      .filter((i) => i.quantity > 0);

    setOrder(newOrder);
    localStorage.setItem(`order_${id}`, JSON.stringify(newOrder));
  };

  const updateNote = (name: string, note: string) => {
    const newOrder = order.map((i) => (i.name === name ? { ...i, note } : i));
    setOrder(newOrder);
    localStorage.setItem(`order_${id}`, JSON.stringify(newOrder));
  };

  const total = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSave = () => {
    localStorage.setItem(`order_${id}`, JSON.stringify(order));
    alert("Porudžbina sačuvana!");
  };

  const handleClear = () => {
    localStorage.removeItem(`order_${id}`);
    const updatedTables = tables.map((t) =>
      t.id === Number(id) ? { ...t, status: "prazno" } : t
    );
    setTables(updatedTables);
    localStorage.setItem("tablesState", JSON.stringify(updatedTables));
    setOrder([]);
    router.push("/tables");
  };

  const handlePaid = () => {
    localStorage.removeItem(`order_${id}`);
    const updatedTables = tables.map((t) =>
      t.id === Number(id) ? { ...t, status: "placeno" } : t
    );
    setTables(updatedTables);
    localStorage.setItem("tablesState", JSON.stringify(updatedTables));
    setOrder([]);
    router.push("/tables");
  };

  return (
    <main className="p-8">
      <h1 className="text-xl font-bold mb-6">
        Sto {id} — Konobar: {waiter}
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {Object.entries(menu).map(([category, items]) => (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-2 capitalize">
              {category}
            </h2>
            {items.map((item) => (
              <button
                key={item.name}
                onClick={() => addItem(item)}
                className="block w-full text-left bg-gray-200 hover:bg-gray-300 p-2 mb-1 rounded"
              >
                {item.name} — {item.price} RSD
              </button>
            ))}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-2">Porudžbina</h2>
      {order.length === 0 ? (
        <p>Nema stavki.</p>
      ) : (
        <div className="space-y-3">
          {order.map((item) => (
            <div key={item.name} className="border p-3 rounded">
              <div className="flex justify-between mb-2">
                <strong>{item.name}</strong>
                <span>{item.price * item.quantity} RSD</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => updateQuantity(item.name, -1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.name, 1)}
                  className="px-2 bg-gray-300 rounded"
                >
                  +
                </button>
              </div>
              <input
                type="text"
                value={item.note}
                onChange={(e) => updateNote(item.name, e.target.value)}
                placeholder="Napomena..."
                className="border p-1 w-full rounded"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <p className="text-lg font-bold">Ukupno: {total} RSD</p>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sačuvaj
          </button>
          <button
            onClick={handleClear}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Obriši sve
          </button>
          <button
            onClick={handlePaid}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Označi kao plaćeno
          </button>
        </div>
      </div>
    </main>
  );
}
