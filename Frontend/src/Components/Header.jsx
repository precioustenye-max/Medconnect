import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartPage from "./UI/CartPage";
import NotificationCenter from "./UI/NotificationCenter";
import { Phone, MessageCircle, Mail, Clock3 } from "lucide-react";
import {
  FaBars,
  FaTimes,
  FaPlus,
  FaShoppingCart,
  FaUser,
  FaHome,
  FaStore,
  FaPrescriptionBottle,
  FaStethoscope,
  FaInfoCircle,
  FaEnvelope,
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
  { label: "About", path: "/about", icon: <FaInfoCircle /> },
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
      // Keep client logout resilient if backend logout fails.
    } finally {
      clearUser();
      navigate("/login", { replace: true });
    }
  };

  const linkClass = ({ isActive }) =>
    `text-base font-semibold transition-colors ${
      isActive ? "text-teal-700" : "text-slate-600 hover:text-teal-700"
    }`;

  const dashboardPath = user?.role === "admin" ? "/admin" : "/pharmacy";

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 border-b border-slate-200 bg-white shadow-sm">

        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <button
            aria-label="Open menu"
            className="rounded-md p-2 text-slate-700 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars className="h-5 w-5" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-600 text-white">
              <FaPlus />
            </div>
            <div className="hidden md:flex md:flex-col">
              <h1 className="text-lg font-bold text-slate-900">MedConnect</h1>
              <p className="text-xs text-slate-500">Trusted digital pharmacy network</p>
            </div>
          </Link>

          <nav className="hidden md:block md:flex-1 md:px-8">
            <ul className="flex items-center justify-center gap-6">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:inline-flex"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="hidden rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-700 md:inline-flex"
                >
                  Create account
                </Link>
              </>
            )}

            {isLoggedIn && (user?.role === "pharmacy" || user?.role === "admin") && (
              <Link
                to={dashboardPath}
                className="hidden rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:inline-flex"
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 md:inline-flex"
              >
                <FaUser />
                <span>Logout</span>
              </button>
            )}

            {isLoggedIn && (
              <NotificationCenter />
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-2 rounded-lg bg-slate-900 px-2.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 md:px-3"
              aria-label="Open cart"
            >
              <FaShoppingCart className="h-4 w-4" />
              <span className="hidden md:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed left-0 top-0 z-50 h-full w-4/5 max-w-xs bg-white p-4 shadow-xl transition-transform duration-300 md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-teal-700">MedConnect</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="rounded-md p-1.5 text-slate-700"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors ${
                    isActive ? "bg-teal-50 text-teal-700" : "text-slate-700 hover:bg-slate-50"
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 space-y-2 border-t border-slate-200 pt-4">
            {isLoggedIn && (user?.role === "pharmacy" || user?.role === "admin") && (
              <Link
                to={dashboardPath}
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-teal-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Create account
                </Link>
              </>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
              >
                <FaUser />
                Logout
              </button>
            )}
          </div>

          <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 text-sm text-slate-600">
            <a href="tel:+1654471272" className="flex items-center gap-2 hover:text-teal-700">
              <Phone className="h-4 w-4" />
              +1 (654) 471-272
            </a>
            <button className="flex items-center gap-2 hover:text-teal-700">
              <MessageCircle className="h-4 w-4" />
              Message support
            </button>
          </div>
        </aside>
      </header>

      <CartPage open={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
