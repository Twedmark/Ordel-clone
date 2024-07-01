import React from "react";
import "./Header.css";

function Footer() {
  return (
    <nav className="footerContainer">
      <div className="smallSection">
        <p>ⓘ</p>
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

export default Footer;
