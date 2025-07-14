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
import { AdminRoute, AuthRoute, PublicRoute } from "./components/ProtectedRoute";
import { useUser } from "./pages/UserContext";

function App() {
  const location = useLocation();
  const { user, loading } = useUser();
  
  const isLogin = location.pathname === "/";
  const isFAQs = location.pathname === "/faqs";
  const isRegister = location.pathname === "/register";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {(isLogin || isFAQs || isRegister) ? (
        <>
          <LNavbar />
          <div className="container">
            <Routes>
              <Route path="/" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
            </Routes>
          </div>
        </>
      ) : (
        <div style={{ display: "block", height: "100vh" }}>
          <Navbar />
          <div className="container" style={{ width: "100%" }}>
            <Routes>
              <Route path="/home" element={
                <AuthRoute>
                  <Home />
                </AuthRoute>
              } />
              <Route path="/reservations" element={
                <AuthRoute>
                  <Reservations />
                </AuthRoute>
              } />
              <Route path="/reserve" element={
                <AuthRoute>
                  <Reserve />
                </AuthRoute>
              } />
              <Route path="/reserve-admin" element={
                <AdminRoute>
                  <ReserveAdmin />
                </AdminRoute>
              } />
              <Route path="/settings" element={
                <AuthRoute>
                  <Settings />
                </AuthRoute>
              } />
              <Route path="/viewusers" element={
                <AuthRoute>
                  <ViewUsers />
                </AuthRoute>
              } />
              <Route path="/userprofile" element={
                <AuthRoute>
                  <UserProfile />
                </AuthRoute>
              } />
              <Route path="/userprofile-edit" element={
                <AuthRoute>
                  <ProfileEdit />
                </AuthRoute>
              } />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;