import React from "react";
import { motion } from "framer-motion";
import Button from "../Components/UI/Button.jsx";
import { FaTruck, FaShieldAlt, FaTimesCircle } from "react-icons/fa";
import ProductSection from "../Components/UI/ProductSection.jsx";
import {
  Star,
  ShieldCheck,
  DollarSign,
  MapPin,
  ShoppingCart,
  Clock,
  CheckCircle,
} from "lucide-react";

/* STRONGER ANIMATION VARIANTS */
const hardFadeUp = {
  hidden: { opacity: 0, y: 100, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18, mass: 0.8 },
  },
};

const hardImage = {
  hidden: { opacity: 0, y: 120, scale: 0.9, rotate: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 70, damping: 16 },
  },
};

const staggerHard = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

/*  MAIN PAGE  */
function HomePage({ searchTerm }) {
  return (
    <main className="flex flex-col overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.img
          src="/assets/Pharmacist.jpg"
          alt="Pharmacist"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-teal-900/70" />

        {/* Hero Content */}
        <motion.div
          className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center text-center"
          variants={staggerHard}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-4xl space-y-8 text-white">
            {/* Badge */}
            <motion.div
              variants={hardFadeUp}
              className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-sm tracking-wide"
            >
              <ShieldCheck size={16} />
              Trusted by 5,000+ Customers
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={hardFadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Smart Pharmacy <br />
              <span className="text-teal-400">Comparison & Ordering</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={hardFadeUp}
              className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto"
            >
              Compare prices, check availability, and order medications securely
              from verified pharmacies near you — all in one place.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={hardFadeUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button to="/shop" color="black">
                Browse Medications
              </Button>
              <Button to="/prescription" color="white">
                Upload Prescription
              </Button>
            </motion.div>

            {/* Feature Icons */}
            <motion.div
              variants={staggerHard}
              className="flex flex-wrap gap-8 pt-6 justify-center"
            >
              <motion.div variants={hardFadeUp}>
                <HeroIcon icon={<FaTruck />} label="Fast Delivery" />
              </motion.div>
              <motion.div variants={hardFadeUp}>
                <HeroIcon icon={<FaShieldAlt />} label="Secure Payments" />
              </motion.div>
              <motion.div variants={hardFadeUp}>
                <HeroIcon icon={<FaTimesCircle />} label="Easy Returns" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ================= PRODUCTS ================= */}
      <ProductSection searchTerm={searchTerm} className="py-16 container mx-auto" />

      {/* ================= WHY CHOOSE ================= */}
      <section className="py-24 px-6 container mx-auto text-center">
        <motion.h2
          variants={hardFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="text-3xl md:text-5xl font-bold mb-4"
        >
          Why Choose Medconnect?
        </motion.h2>

        <motion.p
          variants={hardFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="text-gray-600 max-w-3xl mx-auto mb-16 text-xl"
        >
          A complete pharmacy solution built on trust, transparency, and
          convenience.
        </motion.p>

        <motion.div
          variants={staggerHard}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="grid md:grid-cols-3 gap-8 text-left"
        >
          <FeatureCard
            icon={<ShieldCheck />}
            title="Verified Pharmacies"
            desc="All pharmacies are licensed and audited."
          />
          <FeatureCard
            icon={<DollarSign />}
            title="Price Comparison"
            desc="Compare prices instantly across pharmacies."
          />
          <FeatureCard
            icon={<MapPin />}
            title="Easy Location Access"
            desc="Find nearby pharmacies with real-time stock."
          />
          <FeatureCard
            icon={<ShoppingCart />}
            title="Online Purchasing"
            desc="Secure online checkout and ordering."
          />
          <FeatureCard
            icon={<Clock />}
            title="24/7 Availability"
            desc="Access services anytime, anywhere."
          />
          <FeatureCard
            icon={<Star />}
            title="Quality Assurance"
            desc="Authentic medications guaranteed."
          />
        </motion.div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-gray-50 md:py-24 py-10 px-6">
        <div className="container mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            variants={hardImage}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            src="/assets/pharmacy-1.jpg"
            alt="Pharmacist"
            className="rounded-2xl shadow-lg"
          />

          <motion.div
            variants={staggerHard}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-10 text-xl">
              Get your medications in four simple steps.
            </p>

            <motion.ol className="space-y-6">
              <motion.div variants={hardFadeUp}>
                <Step num="01" title="Search Medications" desc="Browse or search our catalog." />
              </motion.div>
              <motion.div variants={hardFadeUp}>
                <Step num="02" title="Compare Pharmacies" desc="View prices and availability." />
              </motion.div>
              <motion.div variants={hardFadeUp}>
                <Step num="03" title="Place Order" desc="Checkout securely online." />
              </motion.div>
              <motion.div variants={hardFadeUp}>
                <Step num="04" title="Get Delivered" desc="Delivery or pickup in real-time." />
              </motion.div>
            </motion.ol>
          </motion.div>
        </div>
      </section>

      {/* ================= CHALLENGES ================= */}
      <section className="py-24 px-6 container mx-auto grid md:grid-cols-2 gap-16">
        <motion.div
          variants={hardFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Addressing Your Healthcare Challenges
          </h2>

          <p className="text-gray-600 mb-8 text-xl">
            Medconnect solves real-world pharmacy problems with modern technology.
          </p>

          <ul className="space-y-4">
            {[
              "Genuine medications only",
              "Transparent pricing",
              "Nearby pharmacies instantly",
              "Verified licenses",
              "Secure payments",
              "Prescription management",
              "Real-time stock",
              "Fast delivery or pickup",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-lg">
                <CheckCircle className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          variants={hardImage}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          className="bg-gray-100 rounded-2xl"
        >
          <img
            src="/assets/pharma-industry-digital-marketing.jpg"
            alt="Pharmacist"
            className="rounded-2xl shadow-lg h-full"
          />
        </motion.div>
      </section>
    </main>
  );
}

export default HomePage;

/* ================= HELPERS ================= */
function HeroIcon({ icon, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-teal-600 p-4 rounded-full text-white">{icon}</div>
      <span className="mt-2 text-center">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      variants={hardFadeUp}
      className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition"
    >
      <div className="w-12 h-12 bg-teal-50 text-teal-600 flex items-center justify-center rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

function Step({ num, title, desc }) {
  return (
    <li className="flex gap-4">
      <div className="md:w-15 md:h-15 w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
        {num}
      </div>
      <div>
        <h4 className="font-semibold md:text-2xl text-xl">{title}</h4>
        <p className="text-gray-600">{desc}</p>
      </div>
    </li>
  );
}