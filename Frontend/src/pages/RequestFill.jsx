import React, { useState } from "react";
import { motion } from "framer-motion";
import { MyPrescription } from "./MyPrescription"; // Reuse approved prescriptions

const fadeUp = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const RequestFill = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [deliveryOption, setDeliveryOption] = useState("pickup");
  const [submitted, setSubmitted] = useState(false);

  // Sample approved prescriptions
  const approvedPrescriptions = [
    { id: 1, drug: "Amoxicillin 500mg" },
    { id: 2, drug: "Paracetamol 500mg" },
  ];

  const handleSubmit = () => {
    if (!selectedPrescription) return alert("Select a prescription first");
    setSubmitted(true);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 md:px-10 py-10 space-y-8"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-gray-800">
        Request Fill
      </h2>
      <p className="text-gray-600 text-base md:text-lg">
        Select a prescription, choose a pharmacy, and submit your request for
        pickup or delivery.
      </p>

      {!submitted ? (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Prescription Selector */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-semibold mb-4">Select Prescription</h3>
            <div className="space-y-3">
              {approvedPrescriptions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPrescription(p)}
                  className={`w-full text-left px-4 py-3 rounded-xl font-semibold border transition ${
                    selectedPrescription?.id === p.id
                      ? "bg-teal-600 text-white border-teal-600"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {p.drug}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Delivery Options */}
          <motion.div variants={fadeUp}>
            <h3 className="text-xl font-semibold mb-4">Delivery Option</h3>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                  className="form-radio text-teal-600"
                />
                Pickup at Pharmacy
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryOption === "delivery"}
                  onChange={() => setDeliveryOption("delivery")}
                  className="form-radio text-teal-600"
                />
                Home Delivery
              </label>
            </div>
          </motion.div>
        </div>
      ) : (
        <motion.div
          variants={fadeUp}
          className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Request Submitted!
          </h3>
          <p className="text-green-600">
            Your request to fill <strong>{selectedPrescription?.drug}</strong>{" "}
            via {deliveryOption === "delivery" ? "home delivery" : "pickup"} has
            been sent to the pharmacy.
          </p>
        </motion.div>
      )}

      {!submitted && (
        <motion.div variants={fadeUp}>
          <button
            onClick={handleSubmit}
            className={`mt-6 w-full md:w-1/3 py-3 px-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition`}
          >
            Submit Request
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RequestFill;
