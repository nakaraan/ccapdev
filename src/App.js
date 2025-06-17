import LNavbar from "./Navbar-login";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import FAQs from "./pages/FAQs";
import Login from "./pages/Login";
import Reservations from "./pages/Reservations";
import Reserve from "./pages/Reserve";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/";

  return (
    <>
      {isLogin ? (
        <>
          <LNavbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Login />} />
            </Routes>
          </div>
        </>
      ) : (
        <div style={{ display: "block", height: "100vh" }}>
          <Navbar />
          <div className="container" style={{ width: "100%" }}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/users" element={<Users />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/Settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;