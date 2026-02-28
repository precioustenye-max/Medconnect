import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaPlus,
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const quickLinks = [
  { label: "Home", path: "/" },
  { label: "Shop Medications", path: "/shop" },
  { label: "Find Pharmacies", path: "/pharmacies" },
  { label: "Upload Prescription", path: "/prescription" },
  { label: "Health Services", path: "/healthservice" },
];

const companyLinks = [
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
  { label: "Account Registration", path: "/register" },
  { label: "Customer Login", path: "/login" },
];

const linkClass = ({ isActive }) =>
  `text-sm transition-colors ${
    isActive ? "text-white" : "text-slate-300 hover:text-teal-300"
  }`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 border-b border-slate-800 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600 text-white">
                <FaPlus />
              </div>
              <div>
                <h2 className="text-xl font-semibold">MedConnect</h2>
                <p className="text-xs text-slate-400">Professional pharmacy marketplace</p>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">
              Compare trusted pharmacies, upload prescriptions, and order medications with
              secure checkout and reliable support.
            </p>
            <div className="mt-5 flex items-center gap-4 text-xl text-slate-300">
              <a href="#" aria-label="Facebook" className="transition hover:text-teal-300">
                <FaFacebook />
              </a>
              <a href="#" aria-label="WhatsApp" className="transition hover:text-teal-300">
                <FaWhatsapp />
              </a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-teal-300">
                <FaLinkedin />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map((item) => (
                <li key={item.path}>
                  <NavLink to={item.path} className={linkClass}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 shrink-0" />
                120 Health Avenue, Suite 8, Boston, MA
              </li>
              <li className="flex items-center gap-2">
                <FaPhone />
                <a href="tel:+1654471272" className="transition hover:text-teal-300">
                  +1 (654) 471-272
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope />
                <a href="mailto:support@medconnect.com" className="transition hover:text-teal-300">
                  support@medconnect.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid gap-3 pt-6 text-sm text-slate-400 md:grid-cols-2">
          <p>(c) {currentYear} MedConnect. All rights reserved.</p>
          <div className="flex items-center gap-4 md:justify-end">
            <span>Licensed Pharmacies</span>
            <span>Secure Payments</span>
            <span>Data Protected</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
