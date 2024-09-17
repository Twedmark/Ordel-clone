import React, { useContext, useEffect, useState } from "react";
import { makeRow } from "../Gameboard/Gameboard";
import { GameContext } from "../../App";

import "./Modal.css";

function Modal({
  onClose,
  show,
  info = false,
  gameEnd = false,
  isInitialized,
}) {
  const { gameState } = useContext(GameContext);
  const [gameWon, setGameWon] = useState(false);
  let content = {};

  useEffect(() => {
    if (isInitialized && gameState?.pastGuesses.length !== 0) {
      setGameWon(
        gameState.pastGuesses[gameState.pastGuesses.length - 1].result.every(
          (res) => res === "C"
        )
      );
    }
  }, [isInitialized, gameState.pastGuesses]);

  if (!show) {
    return null;
  }

  if (info) {
    content = (
      <>
        <section className="modalHeader">
          <h2>How To Play</h2>
          <h4>Guess the word in 5 tries</h4>
          <p>
            You have 5 attempts to guess the correct word. After each guess, the
            color of the tiles will change depending on how close you are.
          </p>
        </section>
        <br />
        <section className="modalTiles">
          {makeRow(["P", "H", "A", "S", "E"], ["", "W", "C", "", "W"])}
        </section>

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
      </>
    );
  }

  if (gameEnd && !gameWon) {
    content = (
      <>
        <section className="modalHeader">
          <h1>Sorry that was incorrect</h1>
        </section>
        <section className="modalBody">
          <p>
            This website is just for practicing my development skills. Play the
            original game{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="wordleLink"
              href="https://www.nytimes.com/games/wordle/index.html"
            >
              Wordle
            </a>{" "}
            or the swedish version{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="ordelLink"
              href="https://www.ordel.se/"
            >
              Ordel
            </a>{" "}
            where i took a lot of design inspiration from.
          </p>
          <h2>Thanks for playing!</h2>
        </section>
      </>
    );
  }

  if (gameEnd && gameWon) {
    content = (
      <>
        <section className="modalHeader">
          <h1>Congratulations you won!</h1>
        </section>
        <section className="modalBody">
          <p>
            This website is just for practicing my development skills. Play the
            original game{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="wordleLink"
              href="https://www.nytimes.com/games/wordle/index.html"
            >
              Wordle
            </a>{" "}
            or the swedish version{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="ordelLink"
              href="https://www.ordel.se/"
            >
              Ordel
            </a>{" "}
            where i took a lot of design inspiration from.
          </p>
          <h2>Thanks for playing!</h2>
        </section>
      </>
    );
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <p className="closeButton" onClick={onClose}>
            X
          </p>
        </div>
        {content}
      </div>
    </div>
  );
}

export default Modal;
