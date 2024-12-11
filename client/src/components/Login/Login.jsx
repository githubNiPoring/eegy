import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="wrapper">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="row w-100 justify-content-center align-items-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card shadow-lg">
              <div className="container p-2 px-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-egg-fill text-warning fs-2"></i>
                  <h1 className="m-0">
                    EEG<span className="text-warning">y</span>
                  </h1>
                </div>
                <p className="text-secondary">Input valid credentials</p>
                <hr />

                {error && (
                  <div className="bg-danger border border-red-400 text-white px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      aria-label="Email"
                      aria-describedby="basic-addon1"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      aria-label="Password"
                      aria-describedby="basic-addon1"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100 mt-2 d-flex justify-content-center"
                  >
                    <span className="me-1">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    Login
                  </button>
                </form>
                <div className="signup-div d-flex flex-column align-items-center my-3">
                  <p className="text-secondary mb-0">Don't have an account?</p>
                  <a href="/signup" className="signup text-warning">
                    Signup
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
