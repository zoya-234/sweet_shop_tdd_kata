import Login from "./pages/Login";
import Register from "./pages/Register";
import Sweets from "./pages/Sweets";

export default function App() {
  return (
    <div className="container">
      <h1>Sweet Shop Management</h1>
      <Register />
      <Login />
      <Sweets />
    </div>
  );
}
