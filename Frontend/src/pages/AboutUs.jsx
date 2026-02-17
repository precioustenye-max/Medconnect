import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Users, Heart, TrendingUp, Shield, Clock } from 'lucide-react';

const team = [
  {
    name: 'Fonsah Precious Tenye',
    role: 'Founder & CEO',
    description:'Responsible for system design, development, and overall project coordination.',
    image: 'https://images.unsplash.com/photo-1758691462477-976f771224d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxNzYxNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Platform Administrator',
    role: 'System & Operations Manager',
    description: 'Oversees platform configuration, pharmacy onboarding, data integrity, and day-to-day system operations to ensure smooth and reliable service delivery.',
    image: 'https://images.unsplash.com/photo-1615177393114-bd2917a4f74a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwZG9jdG9yJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2MTcwNzE0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    name: 'Pharmacy Partners',
    role: 'Licensed Pharmacy Representatives',
    description: 'Manage their inventory, update product listings, process orders, and ensure timely fulfillment of customer purchases through the Medconnect platform.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYxNzYyMDAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
];

const values = [
  { icon: Heart, title: 'Patient-Centered Care', description: 'We put your health and wellbeing at the center of everything we do.' },
  { icon: Shield, title: 'Quality & Safety', description: 'Committed to the highest standards of pharmaceutical care and safety.' },
  { icon: Users, title: 'Community Focus', description: 'Building lasting relationships with the communities we serve.' },
  { icon: TrendingUp, title: 'Innovation', description: 'Embracing technology to improve healthcare accessibility and outcomes.' }
];

/* ================= ANIMATION VARIANTS ================= */
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const AboutUs = () => {
  return (
    <main className="mt-0 md:mt-20 ">

      {/* ================= ABOUT HEADER ================= */}
      <motion.section
        className="bg-teal-600 py-8 text-white p-6"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-start gap-4 my-8 container mx-auto">
          <h1 className="text-3xl md:text-6xl my-3">About MedConnect</h1>
          <p className="text-base md:text-2xl my-3 max-w-3xl">
            Medconnect is a premium digital healthcare platform that seamlessly connects users to trusted pharmacies, enabling fast, secure, and convenient access to essential medicines in one place.
          </p>
        </div>
      </motion.section>

      {/* ================= STATS ================= */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 container mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {[
          { value: "10K+", label: "Happy Patients" },
          { value: "50+", label: "Pharmacies" },
          { value: "15+", label: "Medicines" },
          { value: "1M+", label: "Transactions" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="p-4 rounded-lg text-center bg-white shadow-md"
          >
            <h2 className="md:text-5xl text-2xl text-teal-600">{stat.value}</h2>
            <p className="text-2xl">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ================= OUR STORY ================= */}
      <motion.section
        className="my-10 p-6 bg-white container mx-auto"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h2 className="text-3xl md:text-5xl text-gray-800 mb-6">Our Story</h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-4">
              Medconnect was created to address a common challenge faced by many individuals: difficulty in finding genuine medications quickly and conveniently. What began as an academic innovation project has grown into a solution aimed at improving healthcare access, especially for communities with limited pharmacy options.
            </p>
            <p className="text-xl md:text-2xl text-gray-700 mb-4">
              By leveraging modern web technologies, Medconnect bridges the gap between patients and pharmacies, reducing stress, saving time, and improving overall healthcare outcomes. Our focus is on reliability, transparency, and user-friendly design.
            </p>
            <p className="text-xl md:text-2xl text-gray-700">
              Our mission is to simplify access to safe and affordable medications by digitally connecting patients with verified pharmacies. We are committed to using technology to support better health decisions and improve quality of life.
            </p>
          </div>
          <div className="flex items-center justify-center mt-6 md:mt-0">
            <motion.img
              src="https://images.unsplash.com/photo-1760115290312-4c0637df790a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjeSUyMHN0b3JlJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYxNzgzNTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="HealthPlus Pharmacy Store"
              className="rounded-2xl w-full h-[400px] object-cover shadow-xl"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            />
          </div>
        </div>
      </motion.section>

      {/* ================= OUR VALUES ================= */}
      <motion.section
        className="my-10 p-6 bg-white rounded-lg max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl text-gray-800 mb-5">Our Values</h2>
          <p className="text-base md:text-xl flex items-center text-gray-700 mb-10">
            Guiding principles that shape how we serve our community
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl shadow"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-teal-100 rounded-full">
                  <value.icon className="text-teal-600 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{value.title}</h3>
                  <p className="text-gray-600 text-xl md:text-2xl">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ================= OUR TEAM ================= */}
      <motion.section
        className="my-10 p-6 bg-white rounded-lg max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl text-gray-800 mb-5">Meet Our Team</h2>
          <p className="text-xl md:text-2xl text-gray-700 mb-10">
            Our dedicated team is committed to delivering exceptional healthcare services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg text-center bg-gray-50 p-4 shadow-md"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-70 mx-auto rounded-2xl object-cover mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.role}</p>
                <p className="text-gray-500">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default AboutUs;
