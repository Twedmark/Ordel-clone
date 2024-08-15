import React, { useState } from "react";
import "./Modal.css";

function Modal({ onClose, show, info = false, gameEnd = false }) {
  console.log("showModal", show);

  console.log("info:", info, " gameEnd:", gameEnd);

  if (!show) {
    return null;
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <p className="closeButton" onClick={onClose}>
            X
          </p>
        </div>
        <section className="modalHeader">
          <h2>How To Play</h2>
          <h4>Guess the word in 5 tries</h4>
          <p>
            You have 5 attempts to guess the correct word. After each guess, the
            color of the tiles will change depending on how close you are.
          </p>
        </section>
        <br />

        <section className="modalHelp">
          <p className="highlighted wrongPlace"> Purple </p> background means
          the letter is <br />
          in the word but not in the right place.
          <br />
          <p className="highlighted correct"> Green </p> background means the
          letter is <br />
          in the right place.
          <br />
          <p className="highlighted incorrect"> Gray </p> background means the
          letter is <br />
          not in the word.
        </section>
      </div>
    </div>
  );
}

export default Modal;
