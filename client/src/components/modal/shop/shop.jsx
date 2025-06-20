import { motion } from "framer-motion";
import axios from "axios";
import { useState, useEffect, act } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

import "./style.css";
import Successfully from "../pop-up/successfully.jsx";
import coin from "../../../../public/assets/misc/coin.png";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const GameShop = ({ onClose }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterImg, setCharacterImg] = useState("");
  const [activeCharId, setActiveCharId] = useState(null);
  const [activeCharImg, setActiveCharImg] = useState(null);
  const [userCoins, setUserCoins] = useState(0);

  const fetchData = async () => {
    try {
      // const userID = Cookies.get("userID");
      const decoded = jwtDecode(token);
      const userID = decoded.id;

      const response = await axios.get(
        `${BASE_URL}/api/v1/characters/notbought/${userID}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      setCharacters(data.notBoughtCharacters);
    } catch (error) {
      if (error.response) {
        console.error("Error updating avatar:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const activeCharacter = async () => {
    try {
      const token = Cookies.get("token");

      const activeCharacterRes = await axios.get(
        `${BASE_URL}/api/v1/characters/active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profile = await axios.get(`${BASE_URL}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserCoins(profile.data.profile.coins);
      if (
        activeCharacterRes.data.character &&
        activeCharacterRes.data.character.charID
      ) {
        const id = activeCharacterRes.data.character.charID;
        setActiveCharId(id);
      } else {
        console.log("No active character found or unexpected response format");
        console.log(
          "Response data structure:",
          JSON.stringify(activeCharacterRes.data)
        );
      }
    } catch (error) {
      console.error("Error fetching used character:", error);
    }
  };

  useEffect(() => {
    activeCharacter();
  }, []);

  const getActiveCharacter = async () => {
    try {
      const charId = activeCharId;
      const activeChar = await axios.get(
        `${BASE_URL}/api/v1/characters/${charId}`
      );
      setActiveCharImg(activeChar.data.character.charImg);
    } catch (error) {
      console.error("Error fetching active character:", error);
    }
  };

  useEffect(() => {
    if (activeCharId !== null) {
      getActiveCharacter();
    }
  }, [activeCharId]);

  // Function to get badge text and color based on category
  const getBadgeInfo = (category) => {
    switch (category) {
      case "legendary":
        return { text: "Legendary! 🌟", color: "#4169e1" };
      case "rare":
        return { text: "Rare! ✨", color: "#9370DB" };
      case "common":
        return { text: "Common 🍀", color: "#3CB371" };
      default:
        return { text: "New! 🎯", color: "#FF7F50" };
    }
  };

  // Function to handle the buy button click
  const handleBuyClick = async (charID, characterName, charimg) => {
    try {
      const buyCharacter = await axios.post(
        `${BASE_URL}/api/v1/characters/buy/${charID}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Open the modal and set the character name
      setCharacterName(characterName);
      setCharacterImg(charimg);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const closeShop = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="modal-full"
    >
      <motion.div
        className="shop-card card w-100 h-100"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <div className="shop-header">
          <div className="d-flex justify-content-between align-items-center">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Magical Shop 🏪
            </motion.h2>
            <motion.button
              className="shop-close-btn"
              onClick={closeShop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-x-circle me-2"></i>
              Close
            </motion.button>
          </div>
        </div>

        <div className="scrollable">
          <div className="container">
            <div className="row">
              <motion.div
                className="col-md-4 col-12 mb-4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center">
                  <motion.img
                    src={activeCharImg}
                    alt="character"
                    className="character m-0"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3
                      style={{
                        color: "#663300",
                        fontFamily: "Comic Sans MS",
                        marginTop: "20px",
                        textShadow: "1px 1px 0 #fff",
                      }}
                    >
                      Your Character
                    </h3>
                    <p className="text-muted">Customize your adventure! ✨</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="coin-display-container d-flex flex-column align-items-center my-4"
                  >
                    <img
                      src={coin}
                      className="coin-logo"
                      alt="coin"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        marginBottom: "8px",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        color: "#FFD700",
                        marginBottom: "2px",
                      }}
                    >
                      {userCoins} coins
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <div className="col-md-8 col-12">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading characters...</p>
                  </div>
                ) : (
                  <div className="row">
                    {characters && characters.length > 0 ? (
                      characters.map((char) => {
                        const badge = getBadgeInfo(char.category);
                        return (
                          <motion.div
                            key={char.charID}
                            className="col-md-6 col-sm-6 col-12 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: char.charID * 0.1 }}
                          >
                            <div className="character-card">
                              <div className="position-relative">
                                <span
                                  className="badge position-absolute top-0 end-0 m-2"
                                  style={{ backgroundColor: badge.color }}
                                >
                                  {badge.text}
                                </span>
                                <div className="character-image-container">
                                  <img
                                    src={char.charImg}
                                    alt={char.characterName}
                                    className="items"
                                  />
                                </div>
                              </div>
                              <div className="character-info p-3">
                                <h5 className="character-name mb-0">
                                  {char.characterName}
                                </h5>
                                <p className="character-desc text-body-secondary mb-0">
                                  {char.charDesc}
                                </p>
                                <div className="d-flex align-items-center justify-content-center mb-1 bg-warning rounded-pill p-2 text-white fw-bold">
                                  <i className="bi bi-c-circle me-2 text-body-warning"></i>
                                  <p className="mb-0 text-price-color">
                                    {char.coins}
                                  </p>
                                </div>
                                <motion.button
                                  className="buy-btn"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() =>
                                    handleBuyClick(
                                      char.charID,
                                      char.characterName,
                                      char.charImg
                                    )
                                  }
                                >
                                  <i className="bi bi-cart me-2"></i>
                                  Buy
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-5">
                        <p>No characters found. Please check back later!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Successfully Modal */}
      <Successfully
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        characterName={characterName}
        characterImage={characterImg}
      />
    </motion.div>
  );
};

export default GameShop;
