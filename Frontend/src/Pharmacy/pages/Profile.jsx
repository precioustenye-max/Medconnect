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
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Profile</h2>
      {error && <p className="text-red-600">{error}</p>}
      {message && <p className="text-green-700">{message}</p>}
      {loading && <p>Loading profile...</p>}

      <form onSubmit={save} className="grid md:grid-cols-3 gap-3 bg-white border rounded-lg p-4">
        <input
          className="border rounded px-3 py-2"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Pharmacy Name"
        />
        <input
          className="border rounded px-3 py-2"
          value={profile.location}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
          placeholder="Location"
        />
        <input
          className="border rounded px-3 py-2"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          className="border rounded px-3 py-2"
          value={profile.licenseNumber}
          onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
          placeholder="License Number"
        />
        <input
          className="border rounded px-3 py-2"
          value={profile.operatingHours}
          onChange={(e) => setProfile({ ...profile, operatingHours: e.target.value })}
          placeholder="Operating Hours"
        />
        <input
          className="border rounded px-3 py-2"
          value={profile.serviceType}
          onChange={(e) => setProfile({ ...profile, serviceType: e.target.value })}
          placeholder="Service Type"
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={profile.delivery} onChange={(e) => setProfile({ ...profile, delivery: e.target.checked })} />
          Delivery available
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={profile.isOpen} onChange={(e) => setProfile({ ...profile, isOpen: e.target.checked })} />
          Open now
        </label>
        <button className="bg-teal-600 text-white px-4 py-2 rounded w-fit" type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
}
