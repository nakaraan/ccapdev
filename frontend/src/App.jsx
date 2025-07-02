import LNavbar from "./Navbar-login";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import FAQs from "./pages/FAQs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Reservations from "./pages/Reservations";
import Reserve from "./pages/Reserve";
import ReserveAdmin from "./pages/ReserveAdmin";
import Settings from "./pages/Settings";
import ViewUsers from "./pages/ViewUsers";
import UserProfile from "./pages/UserProfile";
import ProfileEdit from "./pages/UserProfileEdit";
import { Route, Routes, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/";
  const isFAQs = location.pathname === "/faqs";
  const isRegister = location.pathname === "/register";

  return (
    <>
      {(isLogin || isFAQs || isRegister) ? (
        <>
          <LNavbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </>
      ) : (
        <div style={{ display: "block", height: "100vh" }}>
          <Navbar />
          <div className="container" style={{ width: "100%" }}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/reserve" element={<Reserve />} />
              <Route path="/reserve-admin" element={<ReserveAdmin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/viewusers" element={<ViewUsers />} />
              <Route path="/userprofile" element={<UserProfile />} />
              <Route path="/userprofile-edit" element={<ProfileEdit />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;