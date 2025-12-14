import Login from "./pages/Login";
import Register from "./pages/Register";
import Sweets from "./pages/Sweets";

export default function App() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const token = localStorage.getItem("token");

  return (
    <div className="container">
      <h1>Sweet Shop Management</h1>

      {token && (
        <button
          className="danger"
          onClick={handleLogout}
          style={{ float: "right", marginBottom: "10px" }}
        >
          Logout
        </button>
      )}

      <Register />
      <Login />
      <Sweets />
    </div>
  );
}

