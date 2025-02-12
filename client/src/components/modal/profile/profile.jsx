import React, { useState } from "react";

import "./style.css";
import character from "../../../assets/character.png";
import alphabet from "../../../assets/games/alphabet.png";

const GameProfile = ({ onClose, initialTab }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  const renderContent = () => {
    if (activeTab === "info") {
      return (
        <div className="space-y-6">
          {/* Player Stats Card */}
          <div className="p-6">
            <div className="container">
              <div className="character-header">
                <h1 className="text-center rounded-3 p-2">Player Stats</h1>
              </div>
            </div>
            <div className="card shadow grid grid-cols-2 gap-4">
              <div className="container p-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Total Games Played
                  </h3>
                  <p className="text-3xl font-bold text-primary fs-3">247</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Achievements
                  </h3>
                  <p className="text-3xl font-bold text-yellow-500 fs-3">
                    23/50
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Progress Card */}
          <div className="card shadow mt-4 p-6">
            <div className="container p-4">
              <h2 className="text-2xl font-bold mb-4">Game Progress</h2>
              <div className="space-y-4 fs-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700 pe-2">
                    Current Level:{" "}
                  </span>
                  <span className="text-xl font-bold text-primary">99</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700 pe-2">
                    Total Coins:{" "}
                  </span>
                  <span className="text-xl font-bold text-yellow-500">100</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg text-gray-700 pe-2">
                    Characters Unlocked:{" "}
                  </span>
                  <span className="text-xl font-bold text-purple-600">
                    4/12
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "history") {
      return (
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="character-header">
                <h1 className="text-center rounded-3 p-2">History</h1>
              </div>
            </div>
            <div className="container">
              <div className="character-body">
                <div className="d-flex bg-primary text-white rounded-3 p-2">
                  <img
                    src={alphabet}
                    alt="alphabet"
                    className="history-img-size bg-white p-2 rounded-2 me-2"
                  />
                  <div className="contents">
                    <h3>Alphabet</h3>
                    <h4 className="m-0">Level: 16-20</h4>
                    <h4 className="m-0">Coins: 100</h4>
                    <p className="m-0">duration: 12 mins</p>
                    <p className="m-0">date: 12/23/24</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "characters") {
      return (
        <div className="row">
          <div className="col-12">
            <div className="container">
              <div className="character-header">
                <h1 className="text-center rounded-3 p-2">Characters</h1>
              </div>
            </div>
            <div className="container mt-5">
              <div className="character-body">
                <div className="row bg-warning rounded-3 pb-3 g-4">
                  {/* Character 1 */}
                  <div className="col-lg-6 col-sm-12">
                    <div className="d-flex flex-column align-items-center card bg-gray-500 rounded-3 p-2 h-100">
                      <img
                        src={character}
                        alt="character"
                        className="char-size"
                      />
                    </div>
                  </div>
                  {/* Character 2 */}
                  <div className="col-lg-6 col-sm-12">
                    <div className="d-flex flex-column align-items-center card bg-gray-500 rounded-3 p-2 h-100">
                      <img
                        src={character}
                        alt="character"
                        className="char-size"
                      />
                    </div>
                  </div>
                  {/* Character 3 */}
                  <div className="col-lg-6 col-sm-12">
                    <div className="d-flex flex-column align-items-center card bg-gray-500 rounded-3 p-2 h-100">
                      <img
                        src={character}
                        alt="character"
                        className="char-size"
                      />
                    </div>
                  </div>
                  {/* Character 4 */}
                  <div className="col-lg-6 col-sm-12">
                    <div className="d-flex flex-column align-items-center card bg-gray-500 rounded-3 p-2 h-100">
                      <img
                        src={character}
                        alt="character"
                        className="char-size"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null; // Default case if no tab matches
  };

  return (
    <div className="modal-full">
      <div className="scrollable card w-100 h-100">
        <div className="card-body m-0">
          <div className="d-flex justify-content-between align-items-start w-100">
            <h2 className="m-0">Game Profile</h2>
            <button className="btn btn-warning" onClick={onClose}>
              Close
            </button>
          </div>
          <hr />
          <div className="container p-0 w-100">
            <div className="row">
              <div className="col-md-4 col-12 d-flex flex-lg-column flex-md-column flex-sm-row align-items center p-0 m-0">
                <button
                  className={`btn ${
                    activeTab === "info" ? "btn-warning" : "btn-outline-warning"
                  } w-100 fs-4 p-2 mb-3`}
                  onClick={() => setActiveTab("info")}
                >
                  Info
                </button>
                <button
                  className={`btn ${
                    activeTab === "history"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  } w-100 fs-4 p-2 mb-3`}
                  onClick={() => setActiveTab("history")}
                >
                  History
                </button>
                <button
                  className={`btn ${
                    activeTab === "characters"
                      ? "btn-warning"
                      : "btn-outline-warning"
                  } w-100 fs-4 p-2 mb-3`}
                  onClick={() => setActiveTab("characters")}
                >
                  Characters
                </button>
              </div>

              <div className="col-md-8 col-12">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameProfile;
