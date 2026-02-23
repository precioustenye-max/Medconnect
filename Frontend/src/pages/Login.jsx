import React, { useEffect, useRef, useState } from "react";
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
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const googleBtnRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  const handleGoogleCredential = async (response) => {
    if (!response?.credential) {
      setError("Google login did not return a credential.");
      return;
    }

    setError("");
    setGoogleLoading(true);

    try {
      const res = await API.post("/auth/google", { credential: response.credential });
      setUser(res.data.user);
      navigate(getHomeRouteByRole(res.data.user?.role), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleBtnRef.current) return;

    const initGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });
      googleBtnRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        width: 320,
      });
    };

    if (window.google?.accounts?.id) {
      initGoogleButton();
      return;
    }

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      existingScript.addEventListener("load", initGoogleButton);
      return () => existingScript.removeEventListener("load", initGoogleButton);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleButton;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [googleClientId]);

  return (
    <div className="border border-gray-200 p-4 py-6 rounded-xl shadow-2xl md:w-90 w-80">
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

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-500">OR</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {googleLoading && <p className="text-sm text-gray-500 mb-2">Signing in with Google...</p>}
      {!googleClientId ? (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
          Google login is not configured yet. Set `VITE_GOOGLE_CLIENT_ID` in your frontend environment.
        </p>
      ) : (
        <div ref={googleBtnRef} className="flex justify-center" />
      )}

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
