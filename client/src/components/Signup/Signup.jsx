import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    username: "",
    email: "",
    password: "",
    birthdate: "",
    gender: "Male",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [approve, setApprove] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setApprove("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/signup",
        formData
      );

      if (response.data.success !== true) {
        setError(response.data.message);
        return;
      }

      setApprove(response.data.message);
      setFormData({
        firstname: "",
        lastname: "",
        middlename: "",
        username: "",
        email: "",
        password: "",
        birthdate: "",
        gender: "Male",
      });
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="wrapper"
      style={{ background: "#fff9e6", height: "100vh", overflow: "hidden" }}
    >
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="row w-100 justify-content-center align-items-center">
          <div className="col-12 col-sm-8 col-md-6 col-lg-5">
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "25px",
                background: "white",
                maxHeight: "95vh",
              }}
            >
              <div className="container p-3">
                <div className="text-center mb-2">
                  <div className="d-inline-block position-relative">
                    <i
                      className="bi bi-egg-fill text-warning"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <i
                      className="bi bi-stars position-absolute top-0 end-0 text-warning"
                      style={{ fontSize: "1.2rem" }}
                    ></i>
                  </div>
                  <h1
                    className="mt-2 mb-0"
                    style={{
                      fontFamily: "'Comic Sans MS', cursive",
                      fontSize: "1.8rem",
                    }}
                  >
                    Join EEG<span className="text-warning">y</span>!
                  </h1>
                  <p
                    className="text-secondary mb-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Create your magical account 🌟
                  </p>
                </div>

                {error && (
                  <div
                    className="alert alert-danger py-2 rounded-pill border-0 text-center shadow-sm mb-2"
                    role="alert"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    {error}
                  </div>
                )}
                {approve && (
                  <div
                    className="alert alert-success py-2 rounded-pill border-0 text-center shadow-sm mb-2"
                    role="alert"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    {approve}
                  </div>
                )}
                {loading && (
                  <div className="text-center my-2">
                    <div
                      className="spinner-grow text-warning"
                      role="status"
                      style={{ width: "1rem", height: "1rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-2">
                    <div className="col-12 col-md-6">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="firstname"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleChange}
                          placeholder="First Name"
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="firstname">First Name</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="lastname"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChange}
                          placeholder="Last Name"
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="lastname">Last Name</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="middlename"
                          name="middlename"
                          value={formData.middlename}
                          onChange={handleChange}
                          placeholder="Middle Name"
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="middlename">
                          Middle Name (Optional)
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Username"
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="username">Pick a Cool Username!</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="email"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email"
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="email">Email Address</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="input-group"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <div className="form-floating flex-grow-1">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a Secret Password"
                            required
                            style={{
                              borderRadius: "15px 0 0 15px",
                              height: "calc(2.5rem + 2px)",
                            }}
                          />
                          <label htmlFor="password">
                            Create a Secret Password
                          </label>
                        </div>
                        <button
                          className="btn btn-warning bg-warning bg-opacity-10 border-0"
                          type="button"
                          onClick={togglePasswordVisibility}
                          style={{
                            borderRadius: "0 15px 15px 0",
                            height: "calc(2.5rem + 2px)",
                          }}
                        >
                          <i
                            className={`bi ${
                              showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"
                            } text-warning`}
                          ></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <input
                          type="date"
                          className="form-control form-control-sm border-0 bg-warning bg-opacity-10"
                          id="birthdate"
                          name="birthdate"
                          value={formData.birthdate}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        />
                        <label htmlFor="birthdate">When's Your Birthday?</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div
                        className="form-floating"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <select
                          className="form-select form-select-sm border-0 bg-warning bg-opacity-10"
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          style={{
                            borderRadius: "15px",
                            height: "calc(2.5rem + 2px)",
                          }}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        <label htmlFor="gender">I am a...</label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="submit"
                      className="btn btn-warning w-100 py-2 mb-2 rounded-pill shadow-sm"
                      style={{ fontSize: "1rem" }}
                      disabled={loading}
                    >
                      <i className="bi bi-rocket-takeoff-fill me-2"></i>
                      Start My Adventure!
                    </button>

                    <div className="text-center">
                      <p
                        className="text-secondary mb-2"
                        style={{ fontSize: "0.9rem" }}
                      >
                        Already have an account?
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="btn btn-outline-warning rounded-pill px-3 py-1"
                        style={{ fontSize: "0.9rem" }}
                      >
                        <i className="bi bi-door-open-fill me-2"></i>
                        Back to Login
                      </button>
                    </div>
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

export default Signup;
