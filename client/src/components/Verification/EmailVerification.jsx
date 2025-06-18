import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BASE_URL;
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
      try {
        console.log("Attempting verification for:", { userId, token });

        const response = await axios.get(
          `${BASE_URL}/api/v1/${userId}/verify/${token}`,
          { withCredentials: true }
        );

        console.log("Verification response:", response.data);

        // Always set success to true if we get a 200 response
        setVerificationStatus({
          loading: false,
          success: true,
          message: "Email verified successfully! You can now login.",
        });

        // Automatically redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } catch (error) {
        console.error("Verification error:", error.response || error);
        setVerificationStatus({
          loading: false,
          success: false,
          message:
            error.response?.data?.message ||
            "Verification failed. Please try again.",
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
              {verificationStatus.success ? (
                <p className="text-muted">
                  Redirecting to login page in 3 seconds...
                </p>
              ) : (
                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-warning mt-3"
                >
                  Back to Signup
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
