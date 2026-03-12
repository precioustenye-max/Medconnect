import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  TrendingUp,
  Shield,
  ShoppingCart,
  Store,
  Pill,
  Truck,
} from "lucide-react";

/* ================= TEAM ================= */

const team = [
  {
    name: "Fonsah Precious Tenye",
    role: "Founder & Lead Developer",
    description:
      "Responsible for the system architecture, platform development, and continuous innovation of the MedConnect ecosystem.",
    image:
      "https://images.unsplash.com/photo-1758691462477-976f771224d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Platform Administrator",
    role: "System & Operations Manager",
    description:
      "Manages pharmacy onboarding, verifies listings, and ensures the platform operates smoothly.",
    image:
      "https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Pharmacy Partners",
    role: "Licensed Pharmacy Network",
    description:
      "Our partner pharmacies manage product inventory, fulfill orders, and ensure safe medication delivery.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
];

/* ================= VALUES ================= */

const values = [
  {
    icon: Heart,
    title: "Patient First",
    description:
      "Every feature we build focuses on improving patient access to safe and affordable medicines.",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    description:
      "All pharmacies on our platform are verified to ensure authenticity and quality medications.",
  },
  {
    icon: Users,
    title: "Healthcare Collaboration",
    description:
      "We connect patients, pharmacies, and healthcare providers into one unified digital ecosystem.",
  },
  {
    icon: TrendingUp,
    title: "Technology Innovation",
    description:
      "We use modern technology to simplify how medications are discovered, compared, and delivered.",
  },
];

/* ================= HOW PLATFORM WORKS ================= */

const platformSteps = [
  {
    icon: Pill,
    title: "Search Medicines",
    description:
      "Patients search medications and instantly see availability across multiple pharmacies.",
  },
  {
    icon: Store,
    title: "Compare Pharmacies",
    description:
      "Compare prices, stock levels, and pharmacy locations before making a purchase.",
  },
  {
    icon: ShoppingCart,
    title: "Order Securely",
    description:
      "Add medications to cart and place orders through a secure checkout system.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "Partner pharmacies process the order and deliver medications to your destination.",
  },
];

/* ================= ANIMATION ================= */

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

/* ================= COMPONENT ================= */

const AboutUs = () => {
  return (
    <main className="mt-0 md:mt-20">

      {/* ================= HEADER ================= */}

      <motion.section
        className="bg-teal-600 text-white py-16 px-6"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl mb-6">About MedConnect</h1>

          <p className="text-lg md:text-2xl">
            MedConnect is a digital **pharmacy marketplace platform**
            designed to connect patients with licensed pharmacies.
            Our system allows users to search medications, compare
            pharmacies, and order safely through one unified platform.
          </p>
        </div>
      </motion.section>

      {/* ================= PLATFORM STATS ================= */}

      <motion.section
        className="container mx-auto py-16 px-6 grid grid-cols-2 md:grid-cols-4 gap-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
      >
        {[
          { value: "10K+", label: "Patients Served" },
          { value: "120+", label: "Partner Pharmacies" },
          { value: "15K+", label: "Orders Completed" },
          { value: "99%", label: "Customer Satisfaction" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white shadow-md rounded-xl p-6 text-center"
          >
            <h2 className="text-3xl md:text-4xl text-teal-600 font-bold">
              {stat.value}
            </h2>
            <p className="text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ================= HOW THE PLATFORM WORKS ================= */}

      <motion.section
        className="bg-gray-50 py-20 px-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
      >
        <div className="container mx-auto text-center">

          <h2 className="text-3xl md:text-5xl mb-12">
            How MedConnect Works
          </h2>

          <div className="grid md:grid-cols-4 gap-8">

            {platformSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="bg-white p-6 rounded-xl shadow"
              >
                <div className="w-12 h-12 bg-teal-100 flex items-center justify-center rounded-full mx-auto mb-4">
                  <step.icon className="text-teal-600" />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {step.title}
                </h3>

                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}

          </div>

        </div>
      </motion.section>

      {/* ================= VALUES ================= */}

      <motion.section
        className="container mx-auto py-20 px-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl mb-4">Our Values</h2>
          <p className="text-gray-600">
            Principles that guide how we build and operate MedConnect
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="flex gap-4 p-6 bg-white rounded-xl shadow"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full">
                <value.icon className="text-teal-600" />
              </div>

              <div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </motion.div>
          ))}

        </div>
      </motion.section>

      {/* ================= TEAM ================= */}

      <motion.section
        className="container mx-auto py-20 px-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
      >
        <div className="text-center mb-12">

          <h2 className="text-3xl md:text-5xl mb-4">
            The Team Behind MedConnect
          </h2>

          <p className="text-gray-600">
            The people building the digital pharmacy ecosystem
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {team.map((member, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow p-6 text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <h3 className="text-xl font-semibold">
                {member.name}
              </h3>

              <p className="text-teal-600 mb-2">
                {member.role}
              </p>

              <p className="text-gray-600">
                {member.description}
              </p>

            </motion.div>
          ))}

        </div>
      </motion.section>

    </main>
  );
};

export default AboutUs;
