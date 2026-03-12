import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPublicDrugs } from "../../services/public.api";

const MobileSearchDropdown = ({ searchTerm, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drugs, setDrugs] = useState([]);

  // Fetch real drugs from API on component mount
  useEffect(() => {
    const loadDrugs = async () => {
      try {
        const data = await getPublicDrugs();
        setDrugs(data.items || []);
      } catch (err) {
        console.error("Failed to load drugs:", err);
        setDrugs([]);
      }
    };
    loadDrugs();
  }, []);

  // Filter drugs based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return drugs.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, drugs]);

  const handleChange = (e) => {
    onSearch(e.target.value);
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Slight delay so user can click on dropdown
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div className="md:hidden w-full relative px-4 mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Search medicines, vitamins, supplements…"
          className="w-full pl-4 pr-4 py-2 rounded-lg text-gray-700 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isOpen && filteredProducts.length > 0 && (
        <ul className="absolute z-50 w-full bg-white border mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredProducts.map(product => (
            <li key={product.id}>
              <Link
                to={`/drug/${product.id}/pharmacies`}
                className="block px-4 py-2 hover:bg-blue-50"
                onClick={() => setIsOpen(false)}
              >
                {product.name} - {product.category}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isOpen && searchTerm && filteredProducts.length === 0 && (
        <div className="absolute z-50 w-full bg-white border mt-1 rounded-lg shadow-lg px-4 py-2 text-gray-500">
          No results found
        </div>
      )}
    </div>
  );
};

export default MobileSearchDropdown;
