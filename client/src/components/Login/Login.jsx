import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useAudioContext } from "../../context/AudioContext";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const Login = () => {
  const navigate = useNavigate();
  const { startMusic } = useAudioContext();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await api.post("login", formData);

      if (response.data && response.data.success) {
        // Store token in cookie
        const token = response.data.token;
        if (token) {
          Cookies.set("token", token);
        }

        // Navigate to home
        navigate("/homepage");
      } else {
        setError(response.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "ERR_NETWORK") {
        setError(
          "Unable to connect to the server. Please check if the server is running."
        );
      } else if (error.response) {
        // Server responded with an error
        setError(
          error.response.data?.message ||
            "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        // Request was made but no response
        setError("No response from server. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper" style={{ background: "#fff9e6" }}>
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="row w-100 justify-content-center align-items-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "25px", background: "white" }}
            >
              <div className="container p-4 px-4">
                <div className="text-center mb-4">
                  <div className="d-inline-block position-relative">
                    <i
                      className="bi bi-egg-fill text-warning"
                      style={{ fontSize: "4rem" }}
                    ></i>
                    <i
                      className="bi bi-stars position-absolute top-0 end-0 text-warning"
                      style={{ fontSize: "1.5rem" }}
                    ></i>
                  </div>
                  <h1 className="mt-3 mb-0" style={{ fontSize: "2rem" }}>
                    Welcome to EEG<span className="text-warning">y</span>!
                  </h1>
                  <p className="text-secondary" style={{ fontSize: "1.1rem" }}>
                    Let's start learning! 🎉
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger rounded-pill border-0 text-center shadow-sm"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text border-0 bg-warning bg-opacity-10">
                        <i className="bi bi-envelope-fill text-warning"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-0 bg-warning bg-opacity-10"
                        placeholder="Your Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ borderRadius: "0 15px 15px 0" }}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="input-group input-group-lg">
                      <span className="input-group-text border-0 bg-warning bg-opacity-10">
                        <i className="bi bi-lock-fill text-warning"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 bg-warning bg-opacity-10"
                        placeholder="Secret Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                      <button
                        className="btn btn-warning bg-warning bg-opacity-10 border-0"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ borderRadius: "0 15px 15px 0" }}
                        disabled={isLoading}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          } text-warning`}
                        ></i>
                      </button>
                    </div>
                  </div>
                  {/* <div className="text-end mb-2">
                    <button
                      type="button"
                      className="btn btn-link p-0 text-warning"
                      style={{ fontSize: "0.95rem" }}
                      disabled={isLoading}
                    >
                      Forgot password?
                    </button>
                  </div> */}
                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 mb-3 rounded-pill shadow-sm"
                    style={{ fontSize: "1.1rem" }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Let's Play!
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-secondary mb-2">New to EEGy?</p>
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="btn btn-outline-warning rounded-pill px-4"
                      disabled={isLoading}
                    >
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Join the Fun!
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
