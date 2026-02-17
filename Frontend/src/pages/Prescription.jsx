import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrescripeSection from "./PrescripeSection";
import { MyPrescription } from "./MyPrescription";
import RequestFill  from "./RequestFill";

/* ================= ANIMATION VARIANTS ================= */

const pageFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4 },
  },
};

const fadeUpHard = {
  hidden: { opacity: 0, y: 120, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const sidebarSlide = {
  hidden: { x: -120, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const contentSwitch = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -30,
    transition: { duration: 0.3 },
  },
};

/* ================= PAGE ================= */

const Prescription = () => {
  const [active, setActive] = useState("/prescription");

  const menuItems = [
    { label: "Upload Prescription", path: "/prescription" },
    { label: "My Prescription", path: "/myprescription" },
    { label: "Request Fill", path: "/requestfill" },
  ];

  return (
    <motion.main
      variants={pageFade}
      initial="hidden"
      animate="visible"
      className="mt-10 md:mt-60 mb-20 px-4 md:px-10 container mx-auto"
    >
      {/* ================= HEADER ================= */}
      <motion.div variants={fadeUpHard} initial="hidden" animate="visible">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
          Prescription Management
        </h2>
        <p className="text-base md:text-xl text-gray-600 pt-3">
          Upload and manage your prescriptions securely
        </p>
      </motion.div>

      {/* ================= LAYOUT ================= */}
      <div className="mt-14 grid md:grid-cols-[260px_1fr] gap-10">

        {/* ================= SIDEBAR ================= */}
        <motion.aside
          variants={sidebarSlide}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-gray-50 rounded-2xl shadow-sm p-4 h-fit"
        >
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <motion.li
                key={item.path}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <button
                  onClick={() => setActive(item.path)}
                  className={`w-full text-left px-4 py-3 md:text-xl text-base rounded-xl font-semibold transition-all ${
                    active === item.path
                      ? "bg-teal-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.aside>

        {/* ================= CONTENT ================= */}
        <section className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {active === "/prescription" && (
              <motion.div
                key="upload"
                variants={contentSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <PrescripeSection />
              </motion.div>
            )}

            {active === "/myprescription" && (
              <motion.div
                key="my"
                variants={contentSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <MyPrescription />
              </motion.div>
            )}

            {active === "/requestfill" && (
              <motion.div
                key="request"
                variants={contentSwitch}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl p-8 shadow-md"
              >
                <RequestFill />
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </div>
    </motion.main>
  );
};

export default Prescription;
