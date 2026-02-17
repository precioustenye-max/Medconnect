import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Shield, MapPin, Clock, Search, BadgeCheck, Zap } from "lucide-react";
import PharmacyCard from "../Components/UI/PharmacyCard";
import { getPublicPharmacies } from "../services/public.api";



const getDistance = () => Math.random() * 10; // simulate geo distance (km)

const calculateRankScore = (p) => {
  let score = 0;
  score += p.rating * 2;
  score += p.isOpen ? 5 : 0;
  score += p.verified ? 5 : 0;
  score += p.delivery ? 4 : 0;
  score += p.orders * 0.002;
  score -= p.distance;
  return score;
};

const Pharmacies = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState("");
  const [smartMode, setSmartMode] = useState(true);
  const [filters, setFilters] = useState({
    openNow: false,
    delivery: false,
    verified: false,
    nearest: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);
  
  /* Parallax */
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 120]);

  /* GEO LOCATION */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      });
    }
  }, []);

// pharmacy data
  const pharmaciesRaw = [
    {
      id: 1,
      name: "Pharmacie Centrale Yaoundé",
      location: "Centre Ville",
      isOpen: true,
      verified: true,
      delivery: true,
      rating: 4.8,
      orders: 1250,
    },
    {
      id: 2,
      name: "MediCare Yaoundé",
      location: "Bastos",
      isOpen: true,
      verified: true,
      delivery: true,
      rating: 4.9,
      orders: 2180,
    },
    {
      id: 3,
      name: "Pharmacie du Bien-être",
      location: "Mokolo",
      isOpen: false,
      verified: true,
      delivery: false,
      rating: 4.6,
      orders: 890,
    },
    {
      id: 4,
      name: "City Health Pharmacy",
      location: "Ngoa Ekellé",
      isOpen: true,
      verified: true,
      delivery: true,
      rating: 4.7,
      orders: 1650,
    },
    {
      id: 5,
      name: "Pharmacie Familiale",
      location: "Etoudi",
      isOpen: true,
      verified: false,
      delivery: true,
      rating: 4.5,
      orders: 950,
    },
  ];

   useEffect(() => {
      const load = async () => {
        try {
          setLoading(true);
          setError("");
          const data = await getPublicPharmacies({ limit: 18, page: 1, offset: 0, q: search || undefined });
          setPharmacies(data.items || []);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load pharmacies");
        } finally {
          setLoading(false);
        }
      };
  
      load();
    }, [search]);

  /*  INTELLIGENCE ENGINE  */
  let processed = [...pharmacies];

  /* Search */
  if (search) {
    processed = processed.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.location.toLowerCase().includes(search.toLowerCase())
    );
  }

  /* Filters */
  if (filters.openNow) processed = processed.filter((p) => p.isOpen);
  if (filters.delivery) processed = processed.filter((p) => p.delivery);
  if (filters.verified) processed = processed.filter((p) => p.verified);
  if (filters.nearest) processed = processed.sort((a, b) => a.distance - b.distance);

  /* Smart ranking */
  if (smartMode) {
    processed = processed.sort((a, b) => b.rankScore - a.rankScore);
  }

  return (
    <main className="w-full mt-0 md:mt-20 overflow-hidden">

      {/*  HERO */}
      <section className="relative h-[80vh] w-full flex items-center justify-center">
        <motion.div style={{ y: yBg }} className="absolute inset-0">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url('/assets/Pharmacist.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/75 to-teal-800/65" />

        <div className="relative z-10 max-w-5xl px-4 text-center">
 
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-3xl md:text-6xl font-bold text-white"
          >
            Smart Healthcare Marketplace
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm md:text-xl text-gray-200 mt-4"
          >
            Smart ranking. Verified pharmacies. Intelligent delivery routing.
          </motion.p>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-3 flex items-center gap-3 max-w-2xl mx-auto mt-8"
          >
            <Search className="text-gray-500" />
            <input
              type="text"
              placeholder="Search pharmacy or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none bg-transparent text-gray-700"
            />
            <button className="bg-teal-600 text-white px-5 py-2 rounded-xl hover:bg-teal-700 transition">
              Search
            </button>
          </motion.div>

          {/* SMART FILTERS */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {[
              { key: "openNow", label: "Open Now" },
              { key: "delivery", label: "Delivery" },
              { key: "verified", label: "Verified" },
              { key: "nearest", label: "Nearest" },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilters({ ...filters, [f.key]: !filters[f.key] })}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  filters[f.key]
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white/20 text-white border-white/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* SMART MODE */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setSmartMode(!smartMode)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-semibold transition ${
                smartMode
                  ? "bg-yellow-400 text-black"
                  : "bg-white text-teal-800"
              }`}
            >
              <Zap size={18} />
              Smart Ranking {smartMode ? "ON" : "OFF"}
            </button>
          </div>

        </div>
      </section>

      {/*  TRUST BAR */}
      <div className="flex items-center max-w-3xl py-3 mx-auto gap-3 bg-teal-100 rounded-3xl justify-center text-teal-900 mt-6">
        <Shield className="h-6 w-6" />
        <span className="text-sm md:text-lg font-semibold">
          Government-verified pharmacies • Secure supply chain
        </span>
      </div>

      {/*  GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 px-4 md:px-10">
        {processed.map((pharmacy) => (
          <motion.div
            key={pharmacy.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PharmacyCard pharmacy={pharmacy} smart />
          </motion.div>
        ))}
      </div>

    </main>
  );
};

export default Pharmacies;
