import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Components/UI/Input.jsx";
import Button from "../Components/UI/Button.jsx";
import API from "../services/api.js";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    pharmacyName: "",
    pharmacyLocation: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "pharmacy") {
        payload.pharmacyName = formData.pharmacyName;
        payload.pharmacyLocation = formData.pharmacyLocation;
        payload.phone = formData.phone;
      }

      await API.post("/auth/register", payload);
      setSuccess("Registration successful. You can now log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="border border-gray-200 p-4 py-6 rounded-xl shadow-2xl md:w-110 w-90">
      <h1 className="text-4xl pb-5 font-semibold">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          name="name"
          placeholder="Enter username"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          required
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Account Type</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="patient">Patient</option>
            <option value="pharmacy">Pharmacy</option>
          </select>
        </div>

        {formData.role === "pharmacy" && (
          <>
            <Input
              label="Pharmacy Name"
              name="pharmacyName"
              placeholder="Enter pharmacy name"
              required
              value={formData.pharmacyName}
              onChange={handleChange}
            />

            <Input
              label="Pharmacy Location"
              name="pharmacyLocation"
              placeholder="Enter pharmacy location"
              required
              value={formData.pharmacyLocation}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}

        <Button color="blue" className="w-full mt-3 font-semibold">
          Register
        </Button>
      </form>

      <div className="mt-6 flex gap-3">
        <span className="text-gray-800 font-semibold">Already have an account?</span>
        <Link to="/login" className="text-teal-600 font-semibold border-b">
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Register;
