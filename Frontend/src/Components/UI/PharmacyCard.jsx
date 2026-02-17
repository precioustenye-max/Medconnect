import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Truck, Star, Shield } from 'lucide-react';

const PharmacyCard = ({ pharmacy }) => {
  const navigate = useNavigate();
  const {
    name,
    location,
    isOpen,
    licenseNumber,
    operatingHours,
    serviceType,
    rating,
    ordersCount,
  } = pharmacy;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 cursor-pointer"
      onClick={() => navigate(`/pharmacy/${pharmacy.id}/drugs`)}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{name || "Unknown Pharmacy"}</h3>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{location || "Unknown location"}</span>
          </div>
        </div>
        <div className={`md:px-3 px-2 py-1 rounded-full text-sm font-medium ${
          isOpen
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isOpen ? 'Open' : 'Closed'}
        </div>
      </div>

      {/* Verification / Trust Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center mb-1">
          <Shield className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm md:text-base font-medium text-blue-900">Licensed & Verified</span>
        </div>
        <p className="md:text-base text-sm text-blue-700">License: {licenseNumber || "N/A"}</p>
      </div>

      {/* Operating Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-gray-700">
          <Clock className="w-4 h-4 mr-2" />
          <span className="md:text-base text-sm">{operatingHours || "N/A"}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <Truck className="w-4 h-4 mr-2" />
          <span className="md:text-base text-sm">{serviceType || "N/A"}</span>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm font-medium text-gray-900">{Number(rating || 0).toFixed(1)}</span>
        </div>
        <span className="text-sm text-gray-600">{ordersCount || 0} orders</span>
      </div>

      {/* Call-To-Action Button */}
      <div className={`w-full py-2 px-4 rounded-lg font-medium text-center ${
        isOpen
          ? 'bg-teal-600 text-white'
          : 'bg-gray-300 text-gray-500'
      }`}>
        {isOpen ? 'View Drugs' : 'Currently Closed'}
      </div>
    </div>
  );
};

export default PharmacyCard;
