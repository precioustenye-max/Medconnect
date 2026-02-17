import React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import Button from "../Components/UI/Button";

const Contact = () => {
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const fadeInDelay = delay => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay, duration: 0.6, ease: "easeOut" } },
  });

  return (
    <main className="mt-5 md:mt-20">

      {/* HERO SECTION */}
      <motion.section
        className="bg-gradient-to-br from-teal-600 to-teal-800 text-white py-12 md:py-28"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="container mx-auto px-4 md:px-10">
          <motion.div variants={fadeInDelay(0.1)} className="max-w-3xl">
            <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4">Contact Us</h1>
            <p className="text-base md:text-xl text-teal-100">
              Have questions? We're here to help. Reach out to our team anytime.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CONTACT INFO CARDS */}
      <section className="py-10 container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 -mt-12 md:-mt-20">
          {[
            { icon: MapPin, title: "Our Location", desc: "123 Health St, Wellness City, HC 45678" },
            { icon: Phone, title: "Call Us", desc: "+1 (234) 567-8901" },
            { icon: Mail, title: "Email Us", desc: "contact@medconnect.com" },
            { icon: Clock, title: "Opening Hours", desc: "Mon-Fri: 8AM - 8PM" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-gray-100 p-6 rounded-lg text-center shadow-md"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInDelay(idx * 0.2)}
            >
              <item.icon className="mx-auto mb-4 text-teal-600 w-12 h-12" />
              <h3 className="text-2xl font-semibold mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-600 text-base md:text-lg">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-12 container mx-auto px-4 md:px-10">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <motion.div
            className="lg:col-span-2 rounded-2xl shadow-lg p-6 bg-gray-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInDelay(0.1)}
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageCircle />
              <h2 className="text-3xl font-semibold">Send us a Message</h2>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-xl font-semibold mb-2">Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-xl font-semibold mb-2">Email</label>
                  <input type="email" id="email" placeholder="Your Email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-xl font-semibold mb-2">Phone Number</label>
                  <input type="text" id="phone" placeholder="237 654471272" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"/>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-xl font-semibold mb-2">Subject</label>
                  <select name="subject" id="subject" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-teal-500">
                    <option value="">Select Subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Appointment">Appointment</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-700 text-xl font-semibold mb-2">Message</label>
                <textarea id="message" rows="5" placeholder="How can we help you?" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-teal-500"/>
              </div>
              <Button type="submit" className="flex items-center justify-center gap-2 bg-gray-900 w-full text-white font-medium py-4 rounded-lg hover:bg-black transition duration-300">
                Send Message <Send size={18} />
              </Button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="flex flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInDelay(0.3)}
          >
            <div className="bg-teal-50 p-6 rounded-2xl text-center">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Quick Assistance?</h3>
              <p className="text-gray-600 text-base md:text-lg mb-6">Need immediate help? Our team is available 24/7 to assist you.</p>
              <div className="flex flex-col gap-4">
                <Button color="black" className="flex items-center justify-center gap-2 text-white px-6 py-3 rounded-lg w-full hover:bg-black transition">
                  <Phone /> Call Now
                </Button>
                <Button color="white" className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg w-full hover:bg-gray-200 transition">
                  <MessageCircle /> Live Chat
                </Button>
              </div>
            </div>

            <div className="bg-white border border-blue-200 rounded-2xl p-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Visit Our FAQ</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-xl font-semibold">How do I track my order?</h4>
                  <p>Log in to your account and navigate to the "My Orders" section.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">Can I cancel my order?</h4>
                  <p>You can cancel your order within 1 hour of placing it. Contact us immediately.</p>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">What payment methods are accepted?</h4>
                  <p>We accept all major credit cards, debit cards, and online payment methods.</p>
                </div>
                <Button color="teal" className="mt-4 w-full">Go to FAQs</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* OTHER WAYS TO REACH US */}
      <section className="py-12 px-4 md:px-20 bg-white">
        <motion.h2 className="text-3xl mb-6 text-gray-900" initial={fadeInUp.hidden} animate={fadeInUp.visible}>Other Ways to Reach Us</motion.h2>
        <motion.p className="text-gray-600 text-base md:text-lg mb-8" initial={fadeInDelay(0.1).hidden} animate={fadeInDelay(0.1).visible}>
          Connect with us on social media or visit our help center for more information.
        </motion.p>
        <motion.div className="flex flex-wrap gap-6" initial={fadeInDelay(0.2).hidden} animate={fadeInDelay(0.2).visible}>
          <a href="#" className="text-teal-600 text-2xl hover:scale-110 transition">Facebook</a>
          <a href="#" className="text-teal-600 text-2xl hover:scale-110 transition">Twitter</a>
          <a href="#" className="text-teal-600 text-2xl hover:scale-110 transition">Instagram</a>
          <a href="#" className="text-teal-600 text-2xl hover:scale-110 transition">LinkedIn</a>
        </motion.div>
      </section>
    </main>
  );
};

export default Contact;
