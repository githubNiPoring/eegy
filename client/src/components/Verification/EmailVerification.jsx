import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    success: false,
    message: "",
  });

  // Extract userId and token from URL
  const { userId, token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("Extracted Parameters:", { userId, token });
      try {
        // Construct the verification URL dynamically
        const response = await axios.get(
          `http://localhost:5000/api/v1/${userId}/verify/${token}`
        );

        console.log(response);
        // Successful verification
        setVerificationStatus({
          loading: false,
          success: true,
          message: response.data.message || "Email verified successfully",
        });
      } catch (error) {
        // Handle verification errors
        setVerificationStatus({
          loading: false,
          success: false,
          message: error.response?.data?.message || "Verification failed",
        });
      }
    };

    verifyEmail();
  }, [userId, token, navigate]);

  return (
    <div className="wrapper">
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg p-4">
          {verificationStatus.loading ? (
            <div className="text-center">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Verifying your email...</p>
            </div>
          ) : (
            <div
              className={`text-center ${
                verificationStatus.success ? "text-success" : "text-danger"
              }`}
            >
              <i
                className={`bi ${
                  verificationStatus.success
                    ? "bi-check-circle-fill"
                    : "bi-x-circle-fill"
                } fs-1 mb-3`}
              ></i>
              <h2>
                {verificationStatus.success
                  ? "Verification Successful"
                  : "Verification Failed"}
              </h2>
              <p>{verificationStatus.message}</p>
              {verificationStatus.success && (
                // <p>Click the button below to login</p>
                <button
                  onClick={() => navigate("/login")}
                  className="btn btn-warning mt-3"
                >
                  Click here to Login
                </button>
              )}
              {!verificationStatus.success && (
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-warning mt-3"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
