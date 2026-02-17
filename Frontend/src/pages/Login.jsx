import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../Components/UI/Input.jsx";
import Button from "../Components/UI/Button.jsx";
import API from "../services/api.js";
import { useAuthStore } from "../store/auth.store.js";
import { getHomeRouteByRole } from "../config/roleRoutes.js";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      setUser(response.data.user);

      console.log("Login successful:", response.data);
      navigate(getHomeRouteByRole(response.data.user?.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="border border-gray-200 p-4 py-6 rounded-xl shadow-2xl md:w-110 w-90">
      <h1 className="text-4xl pb-5 font-semibold">Login</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button color="blue" className="w-full mt-3 font-semibold">
          Login
        </Button>
      </form>

      <div className="mt-6 flex gap-3">
        <span className="text-gray-800 font-semibold">
          Don't have an account?
        </span>
        <Link
          to="/register"
          className="text-teal-600 font-semibold border-b"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
