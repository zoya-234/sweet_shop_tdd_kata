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
const [isAdmin, setIsAdmin] = useState(false);


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
    const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.role === "admin");
    } catch {
      setIsAdmin(false);
    }
  } else {
    setIsAdmin(false);
  }
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
        className="input"
        placeholder="Search by name or category"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="primary" onClick={searchSweets}>
        Search
      </button>

      <hr />

      {/* ➕ Add Sweet (admin only) */}
      {isAdmin && (
        <div>
          <input
            className="input"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="input"
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            className="input"
            placeholder="Price"
            type="number"
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            className="input"
            placeholder="Quantity"
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
          />

          <button className="primary" onClick={addSweet}>
            Add Sweet
          </button>

          <hr />
        </div>
      )}

      {/* 🍬 Sweet List */}
      <ul className="sweets-grid">
        {sweets.map((s) => (
          <li key={s._id} className="card">
            <h3>
              {s.name} <small>({s.category})</small>
            </h3>

            <p>₹{s.price}</p>
            <p>Stock: {s.quantity}</p>

            {/* 🛒 Purchase */}
            <button
              className="primary"
              disabled={s.quantity === 0}
              onClick={() => purchaseSweet(s._id)}
            >
              Purchase
            </button>

            {/* 👑 Admin actions */}
            {isAdmin && (
              <div className="admin-actions">
                <button
                  className="success"
                  onClick={() => restockSweet(s._id)}
                >
                  Restock
                </button>

                <button
                  className="danger"
                  onClick={() => deleteSweet(s._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
