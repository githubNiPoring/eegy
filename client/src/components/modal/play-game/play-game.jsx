import { motion } from "framer-motion";

import "./style.css";
import alphabet from "../../../assets/games/alphabet.png";
import word_buddy from "../../../assets/games/word_buddy.png";
import kid_wordle from "../../../assets/games/kid_wordle.png";
import { useNavigate } from "react-router-dom";

const PlayGame = ({ onClose }) => {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{
          duration: 0.3,
          // scale: { type: "spring", damping: 25, stiffness: 500 },
        }}
        className="modal-container container-fluid d-flex justify-content-center m-0 p-0"
      >
        <div className="card w-100 mx-2">
          <div className="card-body p-1">
            <button className="btn btn-danger" onClick={onClose}>
              <h5 className="card-title m-0">Close</h5>
            </button>
            <div className="container mb-5">
              <div className="row justify-content-center align-items-center">
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => navigate("/word-buddy")}
                  className="game card shadow-lg col-12 col-lg-4 col-md-6 col-sm-12 mx-2 my-1"
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-1">
                    <img src={word_buddy} className="card-img-top" alt="..." />
                    <h3 className="m-0">Word Buddy</h3>
                    <div className="description">
                      <p className="m-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, doloremque.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => navigate("/alphabet")}
                  className="game card shadow-lg col-12 col-lg-4 col-md-6 col-sm-12 mx-2 my-1"
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-1">
                    <img src={alphabet} className="card-img-top" alt="..." />
                    <h3 className="m-0">Alphabet</h3>
                    <div className="description">
                      <p className="m-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, doloremque.
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  onClick={() => navigate("/kid-wordle")}
                  className="game card shadow-lg col-12 col-lg-4 col-md-6 col-sm-12 mx-2 my-1"
                >
                  <div className="card-body d-flex flex-column justify-content-center align-items-center p-1">
                    <img src={kid_wordle} className="card-img-top" alt="..." />
                    <h3 className="m-0">Kid Wordle</h3>
                    <div className="description">
                      <p className="m-0">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Consequuntur, doloremque.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default PlayGame;
