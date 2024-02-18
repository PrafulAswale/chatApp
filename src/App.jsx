import Room from "./pages/Room";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./utils/PrivateRoutes";
import { AuthProvider } from "./utils/AuthContext";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Room />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
