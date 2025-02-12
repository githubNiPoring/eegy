import { motion } from "framer-motion";

import character from "../../../assets/character.png";

import "./style.css";

const GameShop = ({ onClose }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="modal-full"
      >
        <div className="scrollable card w-100 h-100">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start w-100">
              <h2 className="m-0">Game Shop</h2>
              <button className="btn btn-warning" onClick={onClose}>
                Close
              </button>
            </div>
            <hr />
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-12 d-flex justify-content-center align-items-center">
                  <img src={character} alt="character" className="character" />
                </div>
                <div className="col-md-8 col-12">
                  <div className="row">
                    {/* items */}
                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                      <div className="bg-gray-500 card p-2">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex justify-content-center">
                            <img src={character} className="items" alt="" />
                          </div>
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex flex-column justify-content-between align-items-center">
                            <h5 className="m-0">Item 1</h5>
                            <p className="m-0">100</p>
                            <button className="btn btn-success">Buy</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* item 2 */}
                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                      <div className="bg-gray-500 card p-2">
                        {/* parent div */}
                        <div className="row">
                          {/* child 1 */}
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex justify-content-center">
                            <img src={character} className="items" alt="" />
                          </div>
                          {/* child 2 */}
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex flex-column justify-content-between align-items-center">
                            <h5 className="m-0">Item 2</h5>
                            <p className="m-0">100</p>
                            <button className="btn btn-success">Buy</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* item 3 */}
                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                      <div className="bg-gray-500 card p-2">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex justify-content-center">
                            <img src={character} className="items" alt="" />
                          </div>
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex flex-column justify-content-between align-items-center">
                            <h5 className="m-0">Item 3</h5>
                            <p className="m-0">100</p>
                            <button className="btn btn-success">Buy</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* item 4 */}
                    <div className="col-12 col-md-6 col-lg-3 mb-3">
                      <div className="bg-gray-500 card p-2">
                        <div className="row">
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex justify-content-center">
                            <img src={character} className="items" alt="" />
                          </div>
                          <div className="col-12 col-sm-6 col-md-12 col-lg-12 d-flex flex-column justify-content-between align-items-center">
                            <h5 className="m-0">Item 4</h5>
                            <p className="m-0">100</p>
                            <button className="btn btn-success">Buy</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default GameShop;
