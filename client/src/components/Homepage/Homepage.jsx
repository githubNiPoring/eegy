import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/eegy", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Adjust for your token storage
          },
        });

        if (response.data.success !== false) {
          setUser(response.data.user.firstname);
        }

        if (response.data.success === false) {
          return <div>Loading...</div>; // Display a loading message while fetching
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className="d-flex justify-content-between align-items-center w-100 px-5">
      <h1>Welcome, {user}</h1>
      <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button>
    </div>
  );
};

export default Homepage;
