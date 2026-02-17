import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

/* ===== Public Pages ===== */
import HomePage from "./pages/HomePage";
import Shop from "./pages/Shop";
import Prescription from "./pages/Prescription";
import HealthService from "./pages/HealthService";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Pharmacies from "./pages/Pharmacies";
import PharmacyDrugs from "./pages/PharmacyDrugs";
import DrugPharmacies from "./pages/DrugPharmacies";
import RequireRole from "./Components/RequireRole";
import PharmacyLayout from "./Pharmacy/layouts/PharmacyLayout";
import PharmacyOverview from "./Pharmacy/pages/Overview";
import PharmacyOrders from "./Pharmacy/pages/Orders";
import PharmacyDrugsPage from "./Pharmacy/pages/Drugs";
import PharmacyProfile from "./Pharmacy/pages/Profile";

/* Admin System */
import AdminLayout from "./Admin/layouts/AdminLayout";
import Dashboard from "./Admin/pages/Dashboard";
import Users from "./Admin/pages/Users";

/* ===== Context ===== */
import { CartProvider } from "./contexts/CartContext";
import { useAuthStore } from "./store/auth.store";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <CartProvider>
      <Routes>

        {/* AUTH ROUTES  */}
        <Route element={<AuthLayout />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/*  MAIN SITE ROUTES  */}
        <Route
          element={
            <MainLayout
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
          }
        >
          <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
          <Route path="/shop" element={<Shop searchTerm={searchTerm} />} />
          <Route path="/prescription" element={<Prescription />} />
          <Route path="/healthservice" element={<HealthService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pharmacies" element={<Pharmacies />} />
          <Route path="/pharmacy/:id/drugs" element={<PharmacyDrugs />} />
          <Route path="/drug/:drugId/pharmacies" element={<DrugPharmacies />} />
         
        </Route>

 <Route
            path="/pharmacy"
            element={
              <RequireRole role="pharmacy">
                <PharmacyLayout />
              </RequireRole>
            }
          >
            <Route index element={<PharmacyOverview />} />
            <Route path="orders" element={<PharmacyOrders />} />
            <Route path="drugs" element={<PharmacyDrugsPage />} />
            <Route path="profile" element={<PharmacyProfile />} />
          </Route>
        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
        </Route>

      </Routes>
    </CartProvider>
  );
}

export default App;
