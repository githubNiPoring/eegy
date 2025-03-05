import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/login",
        formData
      );
      if (!response.data.success) {
        setError(response.data.message);
        return;
      }

      const token = response.data.token;
      Cookies.set("token", token);
      navigate("/home");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
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
                  <h1
                    className="mt-3 mb-0"
                    style={{ fontFamily: "'Comic Sans MS', cursive" }}
                  >
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
                      />
                      <button
                        className="btn btn-warning bg-warning bg-opacity-10 border-0"
                        type="button"
                        onClick={togglePasswordVisibility}
                        style={{ borderRadius: "0 15px 15px 0" }}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                          } text-warning`}
                        ></i>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-warning w-100 py-3 mb-3 rounded-pill shadow-sm"
                    style={{ fontSize: "1.1rem" }}
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Let's Play!
                  </button>

                  <div className="text-center">
                    <p className="text-secondary mb-2">New to EEGy?</p>
                    <button
                      type="button"
                      onClick={() => navigate("/signup")}
                      className="btn btn-outline-warning rounded-pill px-4"
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
