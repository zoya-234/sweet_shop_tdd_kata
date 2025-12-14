import { useEffect, useState } from "react";
import API from "../api";

export default function Sweets() {
  const [sweets, setSweets] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const fetchSweets = async () => {
    const res = await API.get("/sweets");
    setSweets(res.data);
  };

  const searchSweets = async () => {
    const res = await API.get(`/sweets/search?q=${search}`);
    setSweets(res.data);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const addSweet = async () => {
    try {
      await API.post("/sweets", {
  name,
  category, // ✅ SEND CATEGORY
  price: Number(price),
  quantity: Number(quantity),
});
      fetchSweets();
    } catch {
      alert("Login required");
    }
  };

  const deleteSweet = async (id) => {
    await API.delete(`/sweets/${id}`);
    fetchSweets();
  };

  const purchaseSweet = async (id) => {
    const qty = prompt("Enter quantity to purchase:");
    await API.post(`/sweets/purchase/${id}`, {
      quantity: Number(qty),
    });
    fetchSweets();
  };

  const restockSweet = async (id) => {
    const qty = prompt("Enter quantity to restock:");
    await API.post(`/sweets/restock/${id}`, {
      quantity: Number(qty),
    });
    fetchSweets();
  };

  return (
    <div>
      <h2>Sweets</h2>

      <input
        placeholder="Search sweets"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button onClick={searchSweets}>Search</button>

      <hr />

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


      <ul>
        {sweets.map((s) => (
          <li key={s._id}>
  <strong>{s.name}</strong> ({s.category}) – ₹{s.price} – Qty: {s.quantity}
  <br />
  <button onClick={() => purchaseSweet(s._id)}>Purchase</button>
  <button onClick={() => restockSweet(s._id)}>Restock</button>
  <button onClick={() => deleteSweet(s._id)}>Delete</button>
</li>

        ))}
      </ul>
    </div>
  );
}
