import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartPage from "./UI/CartPage";
import { Phone, MessageCircle } from "lucide-react";
import { 
  FaBars, FaTimes, FaPlus, FaShoppingCart, FaUser, 
  FaHome, FaStore, FaPrescriptionBottle, FaStethoscope, 
  FaInfoCircle, FaEnvelope 
} from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import API from "../services/api";
import { useAuthStore } from "../store/auth.store";

const navItems = [
  { label: "Home", path: "/", icon: <FaHome /> },
  { label: "Pharmacies", path: "/pharmacies", icon: <FaStore /> },
  { label: "Shop", path: "/shop", icon: <FaPrescriptionBottle /> },
  { label: "Prescriptions", path: "/prescription", icon: <FaStethoscope /> },
  { label: "Health Services", path: "/healthservice", icon: <FaStethoscope /> },
  { label: "About Us", path: "/about", icon: <FaInfoCircle /> },
  { label: "Contact", path: "/contact", icon: <FaEnvelope /> },
];

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, isCartOpen, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const isLoggedIn = Boolean(user);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      // Still clear client auth state even if backend logout request fails.
    } finally {
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  const linkClass = ({ isActive }) =>
    `font-semibold text-sm md:text-xl transition-colors ${
      isActive ? "text-teal-600" : "text-gray-500 hover:text-teal-600"
    }`;

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
      {/* Main header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FaBars className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 md:w-10 md:h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white">
            <FaPlus />
          </div>
          <div className="hidden md:flex flex-col">
            <h1 className="text-2xl font-semibold text-teal-600">MedLink</h1>
            <p className="text-sm text-gray-600">Your trusted healthcare partner</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block flex-1 mx-6">
          <ul className="flex gap-8 justify-center">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn && (user?.role === "pharmacy" || user?.role === "admin") && (
            <Link to={user?.role === "admin" ? "/admin" : "/pharmacy"} className="hidden md:flex items-center gap-2 text-xl font-medium">
              <span>Dashboard</span>
            </Link>
          )}

          {!isLoggedIn ? (
            <Link to="/register" className="hidden md:flex items-center gap-2">
              <FaUser />
              <span className="text-xl font-medium">Account</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 text-xl font-medium"
            >
              <FaUser />
              <span>Logout</span>
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex bg-black items-center gap-2 rounded-lg py-2 md:px-3 px-2 text-white font-semibold"
          >
            <FaShoppingCart className="w-5 h-3 md:w-5 md:h-5" />
            <span className="hidden md:inline">Cart</span>

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white z-50
          transform transition-transform duration-300 md:hidden
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full  p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-teal-600">MedLink</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <FaTimes className="w-6 h-6" />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-100 text-teal-600 font-semibold"
                      : "text-gray-700 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                <span className="text-base flex-grow">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Contact buttons */}
          <div className="mt-6 pt-4 border-t-1 border-gray-300 flex flex-col gap-3">
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
              <Phone className="w-5 h-5" />
              <span>654 471 272</span>
            </button>
            <button className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Message Us</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Cart Sidebar */}
      <CartPage
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </header>
  );
};

export default Header;
