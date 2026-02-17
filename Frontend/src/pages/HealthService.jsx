import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Components/UI/Button";
import { Heart, Stethoscope, Activity, Syringe, Video, FileText } from 'lucide-react';

const services = [
  {
    icon: Stethoscope,
    title: 'Health Consultations',
    description: 'Speak with licensed pharmacists and healthcare professionals about your health concerns.',
    features: ['15-30 minute consultations', 'Medication reviews', 'Health advice', 'Follow-up support'],
    price: '$29.99',
    badge: 'Popular'
  },
  {
    icon: Syringe,
    title: 'Vaccination Services',
    description: 'Get your flu shots, COVID-19 vaccines, and other immunizations at our pharmacy.',
    features: ['Walk-ins welcome', 'Insurance accepted', 'Digital records', 'Travel vaccines available'],
    price: 'Varies',
    badge: null
  },
  {
    icon: Activity,
    title: 'Health Screenings',
    description: 'Comprehensive health screenings including blood pressure, cholesterol, and glucose testing.',
    features: ['Blood pressure monitoring', 'Cholesterol testing', 'Diabetes screening', 'BMI assessment'],
    price: '$19.99',
    badge: null
  },
  {
    icon: Heart,
    title: 'Chronic Care Management',
    description: 'Ongoing support for managing chronic conditions like diabetes, hypertension, and asthma.',
    features: ['Personalized care plans', 'Medication therapy management', 'Regular check-ins', 'Educational resources'],
    price: '$49.99/month',
    badge: 'Recommended'
  },
  {
    icon: Video,
    title: 'Telehealth Services',
    description: 'Connect with healthcare providers remotely from the comfort of your home.',
    features: ['Video consultations', 'E-prescriptions', 'Same-day appointments', '24/7 availability'],
    price: '$39.99',
    badge: 'New'
  },
  {
    icon: FileText,
    title: 'Medication Therapy Management',
    description: 'Comprehensive medication reviews to optimize your treatment and prevent interactions.',
    features: ['Complete medication review', 'Interaction checks', 'Cost optimization', 'Treatment goals'],
    price: 'Free for eligible patients',
    badge: null
  }
];

// "How It Works" steps
const steps = [
  { title: "Choose a Service", desc: "Select the health service that best fits your needs" },
  { title: "Book Appointment", desc: "Schedule a convenient time that works for you" },
  { title: "Get Service", desc: "Receive care from our qualified healthcare professionals" },
  { title: "Follow Up", desc: "Receive ongoing support and track your health progress" },
];

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" } })
};

const stepVariants = {
  enter: { x: 300, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

const HealthService = () => {
  const [currentStep, setCurrentStep] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextStep = () => setCurrentStep(prev => (prev + 1) % steps.length);
  const prevStep = () => setCurrentStep(prev => (prev - 1 + steps.length) % steps.length);

  return (
    <main className="md:mt-20 mt-5 mb-10">

      {/* HERO SECTION */}
      <motion.div 
        className="bg-teal-600 text-white py-6 flex flex-col items-start px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto">
          <motion.h2 
            className="text-4xl md:text-6xl md:py-8 py-6" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Health Services
          </motion.h2>
          <motion.p 
            className="text-gray-200 text-base md:text-2xl" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Comprehensive healthcare services designed to keep you healthy and informed
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 my-5"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.6 }}
          >
            <Button color="white" className="bg-white text-base md:text-xl text-black font-semibold px-3 rounded-lg py-3 w-full sm:w-auto">
              Book Appointment
            </Button>
            <Button className="py-3 px-3 rounded-lg text-base md:text-xl w-full sm:w-auto">
              Learn more
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* SERVICES GRID */}
      <section className="p-6 bg-white container mx-auto">
        <div className="md:mt-15 mt-7">
          <div className="py-4 gap-3 flex flex-col items-center">
            <h1 className="md:text-6xl text-5xl capitalize text-gray-850">Our Services</h1>
            <p className="text-base md:text-2xl text-gray-500 text-center max-w-3xl">
              From routine health checks to specialized consultations, we're here to support your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {services.map((service, index) => (
              <motion.div 
                key={index} 
                className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
                custom={index}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-15 h-15 flex items-center justify-center bg-teal-100 rounded-full">
                    <service.icon className="text-teal-600 w-8 h-8 mr-3" />
                  </div>
                  {service.badge && (
                    <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-2 py-1 rounded-full">{service.badge}</span>
                  )}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-base md:text-xl text-gray-700 mb-4">{service.description}</p>
                <ul className="list-disc list-inside text-base md:text-lg mb-4 text-gray-600">
                  {service.features.map((feature, idx) => <li key={idx}>{feature}</li>)}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-teal-600">{service.price}</span>
                </div>
                <Button className="w-full mt-4 text-white rounded-lg text-xl">Schedule Service</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS CAROUSEL */}
      <section className="py-8 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-5xl text-gray-900 mb-4">How It Works</h2>
          <p className="text-base md:text-2xl text-gray-600 mb-8">Simple steps to access our health services</p>

          <div className="relative flex items-center justify-center">
            {/* Prev Arrow */}
            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-2 md:p-3 z-10"
              onClick={() => setCurrentStep(prev => (prev - 1 + steps.length) % steps.length)}
            >
              &#8592;
            </button>

            {/* Slide Container */}
            <div className="overflow-hidden w-full md:w-2/3">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  className="text-center"
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, { offset, velocity }) => {
                    if (offset.x < -50) nextStep();
                    if (offset.x > 50) setCurrentStep(prev => (prev - 1 + steps.length) % steps.length);
                  }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl md:text-4xl mx-auto mb-4">
                    {currentStep + 1}
                  </div>
                  <h3 className="text-gray-900 text-xl md:text-2xl mb-2 font-semibold">{steps[currentStep].title}</h3>
                  <p className="text-base md:text-lg text-gray-600">{steps[currentStep].desc}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Arrow */}
            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-teal-600 text-white rounded-full p-2 md:p-3 z-10"
              onClick={nextStep}
            >
              &#8594;
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-4 gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${index === currentStep ? "bg-teal-600" : "bg-gray-300"}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
};

export default HealthService;
