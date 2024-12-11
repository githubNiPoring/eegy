import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [error, setError] = useState("");
  const [approve, setApprove] = useState("");
  const [loading, setLoading] = useState(false);

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

      console.log(response);

      if (response.data.success !== true) {
        setError(response.data.message);
        return;
      }

      setApprove(response.data.message);
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
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
                    EEG<span className="text-warning">y</span> Signup
                  </h1>
                </div>
                <p className="text-secondary">Input valid credentials</p>
                <hr />
                {error && (
                  <div className="bg-danger border border-red-400 text-white px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                {approve && (
                  <div className="bg-success border border-green-400 text-white px-4 py-2 rounded">
                    {approve}
                  </div>
                )}
                {loading && ( // Show loading indicator
                  <div className="text-center">
                    <p>Loading...</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Firstname"
                      aria-label="Firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-person-fill"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Lastname"
                      aria-label="Lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="email"
                      aria-label="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-describedby="basic-addon1"
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
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-warning w-100 mt-2 d-flex justify-content-center"
                  >
                    <span className="me-1">
                      <i className="bi bi-key-fill"></i>
                    </span>
                    Signup
                  </button>
                </form>
                <div className="signup-div d-flex flex-column align-items-center my-3">
                  <p className="text-secondary mb-0">Have an account?</p>
                  <a href="/login" className="signup text-warning">
                    Login
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

export default Signup;
