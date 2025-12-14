import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api";

export default function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");

  // 🔐 determine admin from token
  const token = localStorage.getItem("token");
  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
    } catch (err) {
      isAdmin = false;
    }
  }

  // 🔄 fetch sweets
  const fetchSweets = async () => {
    const res = await API.get("/sweets");
    setSweets(res.data);
  };

  // 🔍 search sweets
  const searchSweets = async () => {
    const res = await API.get(`/sweets/search?q=${search}`);
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  // ➕ add sweet (admin only)
  const addSweet = async () => {
    try {
      await API.post("/sweets", {
        name,
        category,
        price: Number(price),
        quantity: Number(quantity),
      });
      fetchSweets();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Admin access required");
      } else if (err.response?.status === 401) {
        alert("Please login");
      } else {
        alert("Something went wrong");
      }
    }
  };

  // ❌ delete sweet (admin only)
  const deleteSweet = async (id) => {
    try {
      await API.delete(`/sweets/${id}`);
      fetchSweets();
    } catch {
      alert("Admin access required");
    }
  };

  // 🛒 purchase sweet
  const purchaseSweet = async (id) => {
    const qty = prompt("Enter quantity to purchase:");
    if (!qty) return;

    await API.post(`/sweets/purchase/${id}`, {
      quantity: Number(qty),
    });

    fetchSweets();
  };

  // 🔄 restock sweet (admin only)
  const restockSweet = async (id) => {
    const qty = prompt("Enter quantity to restock:");
    if (!qty) return;

    await API.post(`/sweets/restock/${id}`, {
      quantity: Number(qty),
    });

    fetchSweets();
  };

  return (
    <div>
      <h2>Sweets</h2>

      {/* 🔍 Search */}
      <input
        placeholder="Search by name or category"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchSweets}>Search</button>

      <hr />

      {/* ➕ Add Sweet (admin only) */}
      {isAdmin && (
        <>
          <input
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Quantity"
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button onClick={addSweet}>Add Sweet</button>

          <hr />
        </>
      )}

      {/* 🍬 Sweet List */}
      <ul>
        {sweets.map((s) => (
          <li key={s._id}>
            <strong>{s.name}</strong> ({s.category}) – ₹{s.price} – Qty:{" "}
            {s.quantity}
            <br />

            {/* 🛒 Purchase */}
            <button
              disabled={s.quantity === 0}
              onClick={() => purchaseSweet(s._id)}
            >
              Purchase
            </button>

            {/* 👑 Admin actions */}
            {isAdmin && (
              <>
                <button onClick={() => restockSweet(s._id)}>Restock</button>
                <button onClick={() => deleteSweet(s._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
