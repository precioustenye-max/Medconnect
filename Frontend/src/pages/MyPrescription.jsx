import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, CheckCircle, Clock, XCircle, Trash2, UploadCloud } from "lucide-react";

/* ================= ANIMATION VARIANTS ================= */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const skeletonVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/* ================= SAMPLE DATA ================= */

const samplePrescriptions = [
  {
    id: 1,
    drug: "Amoxicillin 500mg",
    date: "12 Jan 2026",
    status: "Approved",
    pharmacy: "Pharmacie Centrale Yaoundé",
  },
  {
    id: 2,
    drug: "Paracetamol 500mg",
    date: "08 Jan 2026",
    status: "Pending",
    pharmacy: "City Health Pharmacy",
  },
  {
    id: 3,
    drug: "Ibuprofen 400mg",
    date: "02 Jan 2026",
    status: "Rejected",
    pharmacy: "MediCare Yaoundé",
  },
];

/* ================= COMPONENT ================= */

export const MyPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  /* ================= SIMULATE DATA LOADING ================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      setPrescriptions(samplePrescriptions);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  /* ================= FILTER FUNCTION ================= */
  const filteredPrescriptions =
    filter === "All"
      ? prescriptions
      : prescriptions.filter((p) => p.status === filter);

  /* ================= HANDLERS ================= */
  const handleDelete = (id) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleReupload = (id) => {
    alert(`Re-upload prescription for ID: ${id}`);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={cardVariants}>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800">My Prescriptions</h3>
        <p className="text-gray-600 mt-1">Track and manage your uploaded prescriptions</p>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div variants={cardVariants} className="flex flex-wrap gap-3 mt-4">
        {["All", "Approved", "Pending", "Rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-full font-semibold transition-all ${
              filter === status ? "bg-teal-600 text-white shadow" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </motion.div>

      {/* Prescription Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {loading ? (
          // ================= SKELETON LOADER =================
          Array(3)
            .fill(0)
            .map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                className="bg-gray-100 animate-pulse rounded-2xl p-6 h-48"
              />
            ))
        ) : filteredPrescriptions.length > 0 ? (
          <AnimatePresence>
            {filteredPrescriptions.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-3 rounded-xl">
                      <FileText className="text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.drug}</h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {item.date}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pharmacy */}
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium text-gray-800">Pharmacy:</span> {item.pharmacy}
                </p>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      item.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status === "Approved" && <CheckCircle className="w-4 h-4" />}
                    {item.status === "Pending" && <Clock className="w-4 h-4" />}
                    {item.status === "Rejected" && <XCircle className="w-4 h-4" />}
                    {item.status}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReupload(item.id)}
                      className="text-teal-600 hover:text-teal-700 flex items-center gap-1 text-sm font-semibold"
                    >
                      <UploadCloud className="w-4 h-4" /> Re-upload
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div variants={cardVariants} className="col-span-full bg-gray-50 rounded-2xl p-10 text-center">
            <p className="text-gray-600">No prescriptions found for this filter.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
