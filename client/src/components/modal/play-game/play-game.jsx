import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import "./style.css";
import axios from "axios";
import { useState, useEffect } from "react";
import React from "react";

import CategorySelectModal from "../category/category-select.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PlayGame = ({ onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState("basic");

  // Helper function to get badge text for difficulty level
  const getBadgeInfo = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "Easy 🌟";
      case "Medium":
        return "Medium ✨";
      case "Hard":
        return "Hard 🎯";
      default:
        return "Easy 🌟"; // Default to Easy if not specified
    }
  };

  // Helper function to get difficulty weight for sorting
  const getDifficultyWeight = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return 1;
      case "Medium":
        return 2;
      case "Hard":
        return 3;
      default:
        return 1; // Default to Easy weight
    }
  };

  // New helper function to handle image paths
  const handleImagePath = (thumbnailUrl) => {
    // If no thumbnail is provided, return a default image
    if (!thumbnailUrl) {
      return "/assets/games/default-game.png";
    }

    // Remove any file system path prefixes
    const cleanPath = thumbnailUrl.replace(/^.*public\//, "");

    // Ensure the path starts with a forward slash and uses the correct public folder structure
    const finalPath = `/assets/games/${cleanPath.split("/").pop()}`;

    return finalPath;
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/games/`);

        // Transform the games data
        const gamesList = response.data.games.map((game) => {
          // Generate route from title if not provided
          let route;
          if (game.route) {
            route = game.route;
          } else {
            route = game.gameTitle.toLowerCase().replace(/\s+/g, "-");
          }

          // Process image URL
          const imageUrl = handleImagePath(game.thumbnailUrl);

          // Set default difficulty if not provided
          let difficulty;
          if (game.gameDifficulty) {
            difficulty = game.gameDifficulty;
          } else {
            difficulty = "Easy";
          }

          return {
            id: game.id,
            title: game.gameTitle,
            description: game.gameDescription,
            route: route,
            imageUrl: imageUrl,
            difficulty: difficulty,
            badge: getBadgeInfo(difficulty),
          };
        });

        // Sort games by difficulty: Easy -> Medium -> Hard
        const sortedGames = gamesList.sort((a, b) => {
          return (
            getDifficultyWeight(a.difficulty) -
            getDifficultyWeight(b.difficulty)
          );
        });

        setGames(sortedGames);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games. Please try again later.");
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Navigate to game and close modal
  const handleGameClick = (game) => {
    setSelectedGame(game);
    setShowCategoryModal(true);
    setShowPlayGame(false);
    // let formattedRoute;
    // if (game.route.startsWith("/")) {
    //   formattedRoute = game.route;
    // } else {
    //   formattedRoute = `/${game.route}`;
    // }
    // // Perform the navigation
    // navigate(formattedRoute);
    // // Close the modal after navigation
    // if (onClose) {
    //   onClose();
    // }
  };

  return (
    <>
      <div className="modal-container">
        <div className="card" data-theme={theme}>
          <div className="card-body">
            <button className="close-btn" onClick={onClose}>
              <i className="bi bi-x-circle me-2"></i>
              Close
            </button>

            <div className="game-selection-container">
              <div className="customCheckBoxHolder">
                <input
                  type="checkbox"
                  name="difficulty"
                  id="cCB1"
                  checked={selectedRadio === "advance"}
                  onChange={() =>
                    setSelectedRadio(
                      selectedRadio === "advance" ? "basic" : "advance"
                    )
                  }
                  className="customCheckBoxInput"
                />
                <label htmlFor="cCB1" className="customCheckBoxWrapper">
                  <div className="customCheckBox">
                    <div className="inner">Advance</div>
                  </div>
                </label>
              </div>
              <div className="text-center mb-3">
                <h2 className="game-selection-title">
                  Choose Your Adventure! 🎮
                </h2>
                <p className="game-selection-subtitle">
                  Pick a fun game and start learning!
                </p>
              </div>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border" role="status"></div>
                  <p>Loading games...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              ) : (
                <div className="games-grid">
                  {games.map((game) => (
                    <div key={game.id || game.title} className="game-card">
                      <div
                        className="game-card-content"
                        onClick={() => handleGameClick(game)}
                      >
                        <div className="game-badge">{game.badge}</div>

                        <div className="game-image-container">
                          <img
                            src={game.imageUrl}
                            className="game-image"
                            alt={game.title}
                          />
                        </div>
                        <h3 className="game-title">{game.title}</h3>
                        <p className="game-description">{game.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CategorySelectModal
        show={showCategoryModal}
        selectedRadio={selectedRadio}
        onSelect={(category) => {
          setShowCategoryModal(false);
          // Navigate to the selected game with the category as a query param
          if (selectedGame) {
            let formattedRoute = selectedGame.route.startsWith("/")
              ? selectedGame.route
              : `/${selectedGame.route}`;
            navigate(
              `${formattedRoute}?category=${category}&difficulty=${selectedRadio}`
            );
            if (onClose) onClose();
          }
        }}
        onClose={() => setShowCategoryModal(false)}
      />
    </>
  );
};

export default PlayGame;
