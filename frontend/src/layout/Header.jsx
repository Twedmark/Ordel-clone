import React from "react";
import "./Header.css";

function Header({ setShowModal }) {
  function toggleModal() {
    setShowModal((prev) => !prev);
  }

  return (
    <nav className="footerContainer">
      <div className="smallSection">
        <p onClick={toggleModal}>ⓘ</p>
      </div>
      <div className="smallSection">
        <h1>Wordle</h1>
      </div>

      <div className="smallSection">
        <a href="https://twedmark.github.io/">My portfolio</a>
      </div>
    </nav>
  );
}

export default Header;
