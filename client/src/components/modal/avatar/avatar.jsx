import { motion } from "framer-motion";

import character from "../../../../public/assets/characters/character.png";

import "./style.css";

const avatar = ({ onClose }) => {
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
              onClick={onClose}
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
                    src={character}
                    alt="character"
                    className="character"
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
                        fontFamily: "'Comic Sans MS', cursive",
                        marginTop: "20px",
                        textShadow: "1px 1px 0 #fff",
                      }}
                    >
                      Your Character
                    </h3>
                    <p className="text-muted">Customize your adventure! ✨</p>
                  </motion.div>
                </div>
              </motion.div>

              <div className="col-md-8 col-12">
                <div className="row g-4">
                  {shopItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="col-12 col-sm-6"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * (index + 1) }}
                    >
                      <motion.div
                        className="shop-item"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="item-badge">{item.badge}</div>
                        <div className="text-center">
                          <motion.img
                            src={item.image}
                            className="items"
                            alt={item.name}
                            animate={{
                              rotate: [0, 5, 0],
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <h4 className="item-name">{item.name}</h4>
                          <p className="item-description">{item.description}</p>
                          <p className="item-price">
                            <i className="bi bi-coin me-1 coin-icon"></i>
                            {item.price}
                          </p>
                          <motion.button
                            className="buy-btn"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <i className="bi bi-cart-plus me-2"></i>
                            Buy Now!
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default avatar;
