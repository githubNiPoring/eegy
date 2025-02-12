import { Route, Routes, Navigate } from "react-router-dom";
// import axios from "axios";

import Notfound from "./components/404page/404";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Homepage from "./components/Homepage/Homepage";
import EmailVerification from "./components/Verification/EmailVerification";

// games
import WordBuddy from "./components/games/word_buddy/word_buddy";
import Alphabet from "./components/games/alphabet/alphabet";
import KidWordle from "./components/games/kid-wordle/kid-wordle";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route
          path="/api/v1/:userId/verify/:token"
          element={<EmailVerification />}
        ></Route>
        <Route path="/home" element={<Homepage />}></Route>
        <Route path="/word-buddy" element={<WordBuddy />}></Route>
        <Route path="/alphabet" element={<Alphabet />}></Route>
        <Route path="/kid-wordle" element={<KidWordle />}></Route>
        <Route path="*" element={<Notfound />}></Route>
      </Routes>
    </>
  );
}

export default App;
