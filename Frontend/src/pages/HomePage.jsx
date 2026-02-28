import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../Components/UI/Button.jsx";
import ProductSection from "../Components/UI/ProductSection.jsx";
import {
  Star,
  ShieldCheck,
  DollarSign,
  MapPin,
  ShoppingCart,
  Clock,
  ChevronDown,
} from "lucide-react";

/* ================= STRONG ANIMATIONS ================= */

const hardFadeUp = {
  hidden: { opacity: 0, y: 100, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const staggerHard = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

/* ================= MAIN ================= */

function HomePage({ searchTerm }) {
  return (
    <main className="flex flex-col overflow-hidden">

      {/* HERO */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.img
          src="/assets/Pharmacist.jpg"
          alt="Pharmacist"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-teal-900/70" />

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center text-white"
          variants={staggerHard}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={hardFadeUp} className="text-4xl md:text-6xl font-bold mb-6">
            Smart Pharmacy <br />
            <span className="text-teal-400">Comparison & Ordering</span>
          </motion.h1>

          <motion.p variants={hardFadeUp} className="max-w-2xl mx-auto mb-8 text-lg">
            Compare prices, verify pharmacies, and order authentic medications securely.
          </motion.p>

          <motion.div variants={hardFadeUp} className="flex justify-center gap-4 flex-wrap">
            <Button to="/shop" color="black">Browse Medications</Button>
            <Button to="/prescription" color="white">Upload Prescription</Button>
          </motion.div>

          <motion.div variants={hardFadeUp} className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Licensed pharmacies</span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Secure checkout</span>
            <span className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5">Prescription verification</span>
          </motion.div>
        </motion.div>
      </section>

      {/* PRODUCT PREVIEW WITH CATEGORY CHIPS */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">

          <motion.h2
            variants={hardFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-center mb-12"
          >
            Browse By Category
          </motion.h2>

          <CategoryChips />

          <div className="mt-12">
            <ProductSection searchTerm={searchTerm} />
          </div>

        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="py-24 container mx-auto px-6 text-center">
        <motion.h2 variants={hardFadeUp} initial="hidden" whileInView="visible" className="text-3xl md:text-5xl font-bold mb-16">
          Why Choose MedConnect?
        </motion.h2>

        <motion.div variants={staggerHard} initial="hidden" whileInView="visible" className="grid md:grid-cols-3 gap-8 text-left">
          <FeatureCard icon={<ShieldCheck />} title="Verified Pharmacies" desc="Licensed and audited." />
          <FeatureCard icon={<DollarSign />} title="Price Comparison" desc="Compare instantly." />
          <FeatureCard icon={<MapPin />} title="Nearby Access" desc="Real-time stock tracking." />
          <FeatureCard icon={<ShoppingCart />} title="Secure Checkout" desc="Safe payments." />
          <FeatureCard icon={<Clock />} title="24/7 Service" desc="Always available." />
          <FeatureCard icon={<Star />} title="Authentic Drugs" desc="Guaranteed genuine." />
        </motion.div>
      </section>

      {/* ANIMATED STATS */}
      <section className="bg-teal-600 text-white py-24">
        <div className="container mx-auto grid md:grid-cols-4 gap-10 text-center">
          <CounterStat target={5000} label="Active Users" />
          <CounterStat target={120} label="Partner Pharmacies" />
          <CounterStat target={15000} label="Orders Delivered" />
          <CounterStat target={99} label="Satisfaction Rate %" />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-16">
            What Our Customers Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard name="Sarah M." role="Patient" text="Fast delivery and secure ordering." />
            <TestimonialCard name="Dr. Kelvin N." role="Doctor" text="Reliable and trustworthy platform." />
            <TestimonialCard name="Brenda T." role="Professional" text="Easy prescription upload." />
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-24 container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
          Frequently Asked Questions
        </h2>

        <FAQAccordion />
      </section>

      {/* FINAL CTA */}
      <section className="bg-slate-900 text-white py-24 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Order Your Medication?
          </h2>
          <div className="flex justify-center gap-4">
            <Button to="/shop" color="black">Start Shopping</Button>
            <Button to="/register" color="white">Create Account</Button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default HomePage;

/* ================= COMPONENTS ================= */

function CategoryChips() {
  const categories = ["Pain Relief", "Antibiotics", "Vitamins", "Diabetes", "Heart Care"];
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {categories.map((cat, i) => (
        <button key={i} className="px-5 py-2 rounded-full border hover:bg-teal-600 hover:text-white transition">
          {cat}
        </button>
      ))}
    </div>
  );
}

function CounterStat({ target, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        clearInterval(counter);
        setCount(target);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target]);

  return (
    <div>
      <h3 className="text-4xl font-bold">{count.toLocaleString()}+</h3>
      <p className="opacity-80">{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div variants={hardFadeUp} className="p-8 border rounded-2xl shadow-sm hover:shadow-lg transition">
      <div className="w-12 h-12 bg-teal-50 text-teal-600 flex items-center justify-center rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ name, role, text }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <div className="flex justify-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
        ))}
      </div>
      <p className="italic mb-4">"{text}"</p>
      <h4 className="font-semibold">{name}</h4>
      <span className="text-sm text-gray-500">{role}</span>
    </div>
  );
}

function FAQAccordion() {
  const faqs = [
    { q: "Are pharmacies verified?", a: "Yes, all pharmacies are licensed and verified." },
    { q: "Is payment secure?", a: "All payments are encrypted and protected." },
    { q: "Can I upload prescriptions?", a: "Yes, pharmacists validate prescriptions before dispatch." },
  ];

  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border rounded-xl">
          <button
            onClick={() => setOpen(open === index ? null : index)}
            className="w-full flex justify-between items-center p-6 font-semibold"
          >
            {faq.q}
            <ChevronDown className={`transition ${open === index ? "rotate-180" : ""}`} />
          </button>
          {open === index && (
            <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
