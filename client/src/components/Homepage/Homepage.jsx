import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import PlayGame from "../modal/play-game/play-game.jsx";
import GameShop from "../modal/shop/shop.jsx";
import GameAchievements from "../modal/achievements/achievements.jsx";
import GameSettings from "../modal/settings/settings.jsx";
import GameProfile from "../modal/profile/profile.jsx";

import "./style.css";
import character from "../../assets/character.png";
import chest from "../../assets/chest.png";
import player from "../../assets/player.jpg";
import coin from "../../assets/coin.png";
import shop from "../../assets/shop.png";
import achievements from "../../assets/achievements.png";
import settings from "../../assets/settings.png";

const Homepage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [showPlayGame, setShowPlayGame] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [profileOpenSource, setProfileOpenSource] = useState("info");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/eegy", {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`, // Adjust for your token storage
          },
        });

        if (response.data.success !== false) {
          setUser(response.data.user.username);
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

  const handleChestClick = () => {
    setProfileOpenSource("characters");
    setShowProfile(true);
  };

  const handlePlayButtonClick = () => {
    setShowPlayGame(true);
  };

  const handleClosePlayGame = () => {
    setShowPlayGame(false);
  };

  const handleShop = () => {
    setShowShop(true);
  };

  const handleCloseShop = () => {
    setShowShop(false);
  };

  const handleAchievements = () => {
    setShowAchievements(true);
  };

  const handleCloseAchievements = () => {
    setShowAchievements(false);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleProfile = () => {
    setProfileOpenSource("info");
    setShowProfile(true);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };
  return (
    <>
      <div className="background"></div>
      <div className="nav enhanced-nav">
        <div className="row d-flex justify-content-between align-items-center w-100 px-5 m-0">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleProfile}
            className="player d-flex justify-content-start align-items-center col-lg-3 col-md-4 col-sm-6 col-xs-12 clickable"
          >
            <img src={player} className="player-logo" alt="player" />
            <p className="info-text mb-0 ms-3">{user}</p>
          </motion.div>
          <div className="coin d-flex justify-content-start justify-content-lg-center justify-content-md-center justify-content-sm-end align-items-center col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <img src={coin} className="coin-logo" alt="" />
            <p className="info-text mb-0 ms-3"> 100</p>
          </div>
          <div className="level d-flex justify-content-start justify-content-lg-end justify-content-md-end align-items-center col-lg-3 col-md-4 col-sm-6 col-xs-12">
            <p className="level-text m-0">Level: 99</p>
          </div>
        </div>
      </div>
      {/* <button onClick={handleLogout} className="btn btn-danger">
        Logout
      </button> */}
      <div className="d-flex flex-column align-items-center">
        <div className="container main">
          <div className="row flex-nowrap">
            <div className="col-8 d-flex justify-content-end justify-content-lg-end justify-content-md-center justify-content-sm-end justify-content-xs-end p-0 pb-5 mb-5">
              <img src={character} className="character" alt="Character" />
            </div>
            <div className="chest col-4 d-flex justify-content-start align-items-center p-0">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleChestClick}
                src={chest}
                className="chest-logo img-fluid mh-100"
                alt="chest"
              />
            </div>
          </div>
          <div className="d-flex justify-content-center w-100">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ duration: 0.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlayButtonClick}
              className="play-btn"
            >
              Play
            </motion.button>
          </div>
        </div>
      </div>
      <div className="others d-flex justify-content-end">
        <div className="d-flex flex-column align-items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShop}
            src={shop}
            className="size"
            alt="shop"
          />
          <p className="mb-2">Shop</p>
        </div>
        <div className="d-flex flex-column align-items-center">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAchievements}
            src={achievements}
            className="size"
            alt="achievements"
          />
          <p className="mb-2">Achievements</p>
        </div>
        <div className="d-flex flex-column align-items-center">
          <motion.img
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            onClick={handleSettings}
            src={settings}
            className="size"
            alt="coin"
          />
          <p className="mb-2">Settings</p>
        </div>
      </div>
      <AnimatePresence>
        {showPlayGame && <PlayGame onClose={handleClosePlayGame} />}
        {showShop && <GameShop onClose={handleCloseShop} />}
        {showAchievements && (
          <GameAchievements onClose={handleCloseAchievements} />
        )}
        {showSettings && <GameSettings onClose={handleCloseSettings} />}
        {showProfile && (
          <GameProfile
            onClose={handleCloseProfile}
            initialTab={profileOpenSource}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Homepage;
