import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { motion } from "framer-motion";

const GameSettings = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="modal-full"
      >
        <div className="card w-100 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start w-100">
              <h2 className="m-0">Game Settings</h2>
              <button className="btn btn-warning" onClick={onClose}>
                Close
              </button>
            </div>
            <hr />
            <a onClick={handleLogout} className="btn btn-outline-danger w-100">
              Log Out
            </a>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default GameSettings;
