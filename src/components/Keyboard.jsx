import React, { useContext, useEffect } from "react";
import { GameContext, RowContext } from "../App";
import "./Keyboard.css";

function Keyboard() {
  const { word, triedLetters, LettersInRightPlace } = useContext(GameContext);
  const { activeRow } = useContext(RowContext);

  useEffect(() => {}, [activeRow, triedLetters]);

  const creteButton = (letter, index) => {
    let isLetterInRightPlace = false;
    let isLetterInWord = false;
    let isLetterTried = false;

    for (let i = 0; i < LettersInRightPlace.length; i++) {
      if (LettersInRightPlace[i] === letter.toUpperCase()) {
        isLetterInRightPlace = true;
      }
    }

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter.toUpperCase()) {
        isLetterInWord = true;
      }
    }

    for (let i = 0; i < triedLetters.length; i++) {
      if (triedLetters[i] === letter.toUpperCase()) {
        isLetterTried = true;
      }
    }

    return (
      <button
        key={index}
        className={`key ${isLetterInRightPlace ? "Correct" : ""}${
          isLetterInWord && isLetterTried && !isLetterInRightPlace
            ? "WrongPlace"
            : ""
        }${isLetterTried && !isLetterInWord ? "Incorrect" : ""}`}
      >
        {letter}
      </button>
    );
  };

  return (
    <section className="keyboard">
      <div className="keys">
        {Array.from("QWERTYUIOPÅASDFGHJKLÖÄZXCVBNM").map((letter, index) =>
          creteButton(letter, index)
        )}
      </div>
    </section>
  );
}

export default Keyboard;
