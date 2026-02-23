import { useEffect, useState } from "react";
import { getMyPharmacyProfile, updateMyPharmacyProfile } from "../../services/pharmacy.api";

export default function PharmacyProfile() {
  const [profile, setProfile] = useState({
    name: "",
    location: "",
    phone: "",
    licenseNumber: "",
    operatingHours: "",
    serviceType: "",
    delivery: false,
    isOpen: true,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getMyPharmacyProfile();
        setProfile({
          name: res.name || "",
          location: res.location || "",
          phone: res.phone || "",
          licenseNumber: res.licenseNumber || "",
          operatingHours: res.operatingHours || "",
          serviceType: res.serviceType || "",
          delivery: Boolean(res.delivery),
          isOpen: typeof res.isOpen === "boolean" ? res.isOpen : true,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await updateMyPharmacyProfile(profile);
      setMessage("Profile updated successfully");
      setIsEditing(false);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reload original profile data
    load();
  };

  const load = async () => {
    try {
      const res = await getMyPharmacyProfile();
      setProfile({
        name: res.name || "",
        location: res.location || "",
        phone: res.phone || "",
        licenseNumber: res.licenseNumber || "",
        operatingHours: res.operatingHours || "",
        serviceType: res.serviceType || "",
        delivery: Boolean(res.delivery),
        isOpen: typeof res.isOpen === "boolean" ? res.isOpen : true,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pharmacy profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Pharmacy Profile</h2>
          <p className="text-gray-500 mt-1">Manage your pharmacy information and settings</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700">{message}</p>
          </div>
        </div>
      )}

      {/* Profile Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header with Status */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{profile.name || "Pharmacy Name"}</h3>
                <p className="text-teal-100 text-sm">License: {profile.licenseNumber || "Not provided"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.isOpen 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {profile.isOpen ? "● Open Now" : "○ Closed"}
              </span>
              {profile.delivery && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  🚚 Delivery Available
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={save} className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
                Basic Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pharmacy Name
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter pharmacy name"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">
                    {profile.name || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.licenseNumber}
                    onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                    placeholder="Enter license number"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">
                    {profile.licenseNumber || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.serviceType}
                    onChange={(e) => setProfile({ ...profile, serviceType: e.target.value })}
                    placeholder="e.g., Retail, Clinical, Compounding"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2">
                    {profile.serviceType || "—"}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
                Contact Information
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="Enter full address"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {profile.location || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {profile.phone || "—"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Hours
                </label>
                {isEditing ? (
                  <input
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    value={profile.operatingHours}
                    onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
                    placeholder="e.g., Mon-Fri 9AM-6PM, Sat 9AM-2PM"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-4 py-2 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {profile.operatingHours || "—"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100 mb-4">
              Pharmacy Settings
            </h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      checked={profile.delivery} 
                      onChange={(e) => setProfile({ ...profile, delivery: e.target.checked })} 
                    />
                    <div>
                      <span className="font-medium text-gray-800">Delivery Available</span>
                      <p className="text-sm text-gray-500">Enable delivery services for customers</p>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                      checked={profile.isOpen} 
                      onChange={(e) => setProfile({ ...profile, isOpen: e.target.checked })} 
                    />
                    <div>
                      <span className="font-medium text-gray-800">Open Now</span>
                      <p className="text-sm text-gray-500">Show pharmacy as currently open</p>
                    </div>
                  </label>
                </>
              ) : (
                <div className="col-span-2 grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${profile.delivery ? 'bg-green-100' : 'bg-gray-200'}`}>
                        <svg className={`w-5 h-5 ${profile.delivery ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Delivery Available</p>
                        <p className="text-sm text-gray-500">{profile.delivery ? 'Enabled' : 'Disabled'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${profile.isOpen ? 'bg-green-100' : 'bg-gray-200'}`}>
                        <svg className={`w-5 h-5 ${profile.isOpen ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Status</p>
                        <p className="text-sm text-gray-500">{profile.isOpen ? 'Open for business' : 'Currently closed'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="mt-8 flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Additional Information Card */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-blue-900">Profile Information</h4>
            <p className="text-sm text-blue-700 mt-1">
              Keep your pharmacy information up to date to ensure customers can reach you easily. 
              Your profile will be visible to customers when they search for pharmacies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}