import Login from "./pages/Login";
import Register from "./pages/Register";
import Sweets from "./pages/Sweets";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Sweet Shop Management</h1>
      <Register />
      <hr />
      <Login />
      <hr />
      <Sweets />
    </div>
  );
}

export default App;
